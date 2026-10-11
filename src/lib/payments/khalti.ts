import 'server-only';
import { getKhaltiConfig, getSiteUrl } from './config';
import { PaymentGatewayError } from './errors';

/**
 * Khalti ePayment (web checkout) adapter.
 *
 * FLOW
 *  1. Server calls /initiate/ with the SECRET key → gets { pidx, payment_url }.
 *  2. Browser is redirected to payment_url.
 *  3. Khalti redirects back to return_url?pidx=...&status=...&purchase_order_id=...
 *  4. Callback params are NOT signed, so the server MUST call /lookup/ with the pidx
 *     and trust only that response (lookupKhaltiPayment).
 *
 * Amounts are in PAISA (1 NPR = 100 paisa). Khalti's minimum is NPR 10.
 */
export const nprToPaisa = (npr: number) => Math.round(npr * 100);

function authHeaders() {
  const { secretKey } = getKhaltiConfig();
  // The header value is literally the word "Key", a space, then your secret key.
  return { Authorization: `Key ${secretKey}`, 'Content-Type': 'application/json' };
}

export async function initiateKhaltiPayment(args: { orderId: string; totalNpr: number; orderName: string }) {
  const { baseUrl } = getKhaltiConfig();
  const site = getSiteUrl();

  const res = await fetch(`${baseUrl}/initiate/`, {
    method: 'POST',
    headers: authHeaders(),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      return_url: `${site}/buyer/payment-success`, // where Khalti sends the customer afterwards
      website_url: site,
      amount: nprToPaisa(args.totalNpr),
      purchase_order_id: args.orderId,             // your order id, echoed back in the callback
      purchase_order_name: args.orderName,
      // customer_info: { name, email, phone }     // optional: add once you collect buyer profile data
    }),
  });

  const json = (await res.json().catch(() => null)) as { pidx?: string; payment_url?: string } | null;
  if (!res.ok || !json?.pidx || !json?.payment_url) {
    console.error('[khalti] initiate failed', res.status, json); // never log the secret key
    throw new PaymentGatewayError('Khalti could not start the payment.');
  }
  return { pidx: json.pidx, paymentUrl: json.payment_url };
}

/** Authoritative payment status. Returns null if Khalti is unreachable (treat as "pending"). */
export async function lookupKhaltiPayment(pidx: string) {
  const { baseUrl } = getKhaltiConfig();
  try {
    const res = await fetch(`${baseUrl}/lookup/`, {
      method: 'POST', headers: authHeaders(), cache: 'no-store',
      signal: AbortSignal.timeout(10_000), body: JSON.stringify({ pidx }),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { status?: string; total_amount?: number; transaction_id?: string | null };
    if (typeof j.status !== 'string') return null;
    return {
      status: j.status,                 // Completed | Pending | Initiated | Expired | User canceled | Refunded
      totalAmountPaisa: j.total_amount ?? 0,
      transactionId: j.transaction_id ?? null,
    };
  } catch {
    return null;
  }
}
