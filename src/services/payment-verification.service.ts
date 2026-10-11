import 'server-only';
import { isMockVerifyEnabled, getEsewaConfig } from '@/lib/payments/config';
import {
  decodeEsewaCallback, lookupEsewaStatus, parseEsewaAmount, verifyEsewaSignature,
} from '@/lib/payments/esewa';
import { lookupKhaltiPayment, nprToPaisa } from '@/lib/payments/khalti';
import { getOrder, markOrderFailed, markOrderPaid, type Order } from '@/lib/mock-orders';

/**
 * PAYMENT VERIFICATION: runs on the server when the customer lands back on /buyer/payment-success.
 * The URL the browser arrives with is attacker-controllable, so NOTHING in it is trusted until:
 *   (1) signature/identifiers check out, (2) the order exists in OUR database and belongs to this
 *   buyer, (3) the amount matches what WE charged, and (4) the gateway itself confirms the payment.
 */
export type VerificationOutcome =
  | { kind: 'success'; order: Order; paymentRef: string; alreadyProcessed: boolean }
  | { kind: 'pending'; message: string }
  | { kind: 'failed'; message: string }
  | { kind: 'invalid'; message: string };

type Query = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const invalid = (message: string): VerificationOutcome => ({ kind: 'invalid', message });

export async function verifyPaymentCallback(query: Query, buyerId: string): Promise<VerificationOutcome> {
  const esewaData = first(query.data);
  if (esewaData) return verifyEsewa(esewaData, buyerId);
  if (first(query.pidx)) return verifyKhalti(query, buyerId);
  return invalid('No payment information was received.');
}

// ------------------------------- eSewa -------------------------------------
async function verifyEsewa(encoded: string, buyerId: string): Promise<VerificationOutcome> {
  const cb = decodeEsewaCallback(encoded);
  if (!cb) return invalid('We could not read the payment response.');
  if (!verifyEsewaSignature(cb)) return invalid('The payment response failed its security check.');

  // Check the transaction id against OUR database.
  const order = getOrder(cb.transaction_uuid);
  if (!order || order.buyerId !== buyerId || order.gateway !== 'esewa') return invalid('We could not find a matching order.');

  // Idempotency: refreshing the page must not re-process.
  if (order.status === 'paid') return { kind: 'success', order, paymentRef: order.paymentRef ?? cb.transaction_code, alreadyProcessed: true };

  if (cb.product_code !== getEsewaConfig().productCode) return invalid('The payment response does not match this store.');
  if (cb.status !== 'COMPLETE') { markOrderFailed(order.id); return { kind: 'failed', message: 'The payment was not completed.' }; }

  if (parseEsewaAmount(cb.total_amount) !== order.totalNpr) {
    console.warn('[payments] eSewa amount mismatch', { orderId: order.id, expected: order.totalNpr, got: cb.total_amount });
    markOrderFailed(order.id);
    return invalid('The paid amount does not match your order. Please contact support.');
  }

  // Server-to-server confirmation (skipped only when PAYMENT_MOCK_VERIFY=true in dev).
  if (isMockVerifyEnabled()) {
    console.info('[mock] skipping eSewa status lookup for', order.id);
  } else {
    const remote = await lookupEsewaStatus({ orderId: order.id, totalNpr: order.totalNpr });
    if (!remote) return { kind: 'pending', message: 'We could not confirm your payment with eSewa yet. Please refresh in a moment.' };
    if (remote.status !== 'COMPLETE') return { kind: 'failed', message: `eSewa reports this payment as ${remote.status}.` };
  }

  const paid = markOrderPaid(order.id, cb.transaction_code)!;
  return { kind: 'success', order: paid, paymentRef: cb.transaction_code, alreadyProcessed: false };
}

// ------------------------------- Khalti ------------------------------------
async function verifyKhalti(query: Query, buyerId: string): Promise<VerificationOutcome> {
  const pidx = first(query.pidx);
  const orderId = first(query.purchase_order_id);
  if (!pidx || !orderId) return invalid('The payment response is incomplete.');

  // The pidx we stored at initiation must match: stops someone pairing their own pidx with your order id.
  const order = getOrder(orderId);
  if (!order || order.buyerId !== buyerId || order.gateway !== 'khalti' || order.gatewayRef !== pidx) {
    return invalid('We could not find a matching order.');
  }
  if (order.status === 'paid') return { kind: 'success', order, paymentRef: order.paymentRef ?? pidx, alreadyProcessed: true };

  // Khalti's callback is unsigned, so the lookup API is the ONLY trustworthy source.
  if (isMockVerifyEnabled()) {
    console.info('[mock] skipping Khalti lookup for', order.id);
    if (first(query.status) !== 'Completed') { markOrderFailed(order.id); return { kind: 'failed', message: 'The payment was not completed.' }; }
    const paid = markOrderPaid(order.id, first(query.transaction_id) ?? 'MOCK-TXN')!;
    return { kind: 'success', order: paid, paymentRef: paid.paymentRef!, alreadyProcessed: false };
  }

  const remote = await lookupKhaltiPayment(pidx);
  if (!remote) return { kind: 'pending', message: 'We could not confirm your payment with Khalti yet. Please refresh in a moment.' };

  switch (remote.status) {
    case 'Completed': {
      if (remote.totalAmountPaisa !== nprToPaisa(order.totalNpr)) {
        console.warn('[payments] Khalti amount mismatch', { orderId: order.id, expected: nprToPaisa(order.totalNpr), got: remote.totalAmountPaisa });
        markOrderFailed(order.id);
        return invalid('The paid amount does not match your order. Please contact support.');
      }
      const paid = markOrderPaid(order.id, remote.transactionId ?? pidx)!;
      return { kind: 'success', order: paid, paymentRef: paid.paymentRef!, alreadyProcessed: false };
    }
    case 'Pending':
    case 'Initiated':
      return { kind: 'pending', message: 'Your payment is still being processed. Please refresh in a moment.' };
    default: // Expired | User canceled | Refunded | anything unexpected
      markOrderFailed(order.id);
      return { kind: 'failed', message: `Khalti reports this payment as "${remote.status}".` };
  }
}
