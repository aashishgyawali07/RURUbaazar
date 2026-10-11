import 'server-only';
import { randomUUID } from 'node:crypto';
import { MAX_QTY_PER_LINE } from '@/lib/cart/cart-reducer';
import { getProductById } from '@/lib/mock-data';
import { attachGatewayRef, createOrder, markOrderFailed, type OrderItem } from '@/lib/mock-orders';
import { PaymentConfigError } from '@/lib/payments/errors';
import { buildEsewaFormPayload } from '@/lib/payments/esewa';
import { initiateKhaltiPayment } from '@/lib/payments/khalti';
import type { PaymentInitiation } from '@/lib/payments/types';

/**
 * CHECKOUT SERVICE: the trust boundary.
 * Everything from the browser is untrusted. We accept ONLY product ids + quantities,
 * then rebuild line items and the total from our own catalogue.
 */
export type CheckoutResult =
  | { ok: true; data: PaymentInitiation }
  | { ok: false; error: string; status: 400 | 502 | 503 };

const MAX_LINES = 30;
const KHALTI_MIN_NPR = 10;
const bad = (error: string): CheckoutResult => ({ ok: false, error, status: 400 });

export async function initiateCheckout(input: { buyerId: string; gateway: unknown; items: unknown }): Promise<CheckoutResult> {
  const { buyerId, gateway, items } = input;

  // 1. Validate input shape.
  if (gateway !== 'esewa' && gateway !== 'khalti') return bad('Choose a valid payment method.');
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) return bad('Your cart is empty or invalid.');

  const merged = new Map<string, number>(); // productId → quantity (duplicates merged)
  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) return bad('Your cart is invalid.');
    const { productId, quantity } = raw as { productId?: unknown; quantity?: unknown };
    if (typeof productId !== 'string' || typeof quantity !== 'number' ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      return bad('Your cart contains an invalid item.');
    }
    merged.set(productId, Math.min((merged.get(productId) ?? 0) + quantity, MAX_QTY_PER_LINE));
  }

  // 2. Re-price from the catalogue (never from the client).
  const orderItems: OrderItem[] = [];
  for (const [productId, quantity] of merged) {
    const product = getProductById(productId);
    if (!product) return bad('An item in your cart is no longer available.');
    orderItems.push({ productId, title: product.title, unitPriceNpr: product.priceNpr, quantity });
  }
  const totalNpr = orderItems.reduce((sum, i) => sum + i.unitPriceNpr * i.quantity, 0);
  if (gateway === 'khalti' && totalNpr < KHALTI_MIN_NPR) return bad(`Khalti requires a minimum of NPR ${KHALTI_MIN_NPR}.`);

  // 3. Persist a PENDING order. Its id doubles as the gateway's transaction id.
  const order = createOrder({ id: randomUUID(), buyerId, gateway, items: orderItems, totalNpr });

  // 4. Ask the chosen gateway how the browser should proceed.
  try {
    if (gateway === 'esewa') {
      const { url, fields } = buildEsewaFormPayload({ orderId: order.id, totalNpr });
      return { ok: true, data: { gateway: 'esewa', action: 'POST_FORM', url, fields } };
    }
    const itemCount = orderItems.reduce((n, i) => n + i.quantity, 0);
    const { pidx, paymentUrl } = await initiateKhaltiPayment({
      orderId: order.id, totalNpr, orderName: `Marketplace order (${itemCount} items)`, // TODO: brand name
    });
    attachGatewayRef(order.id, pidx); // needed later to match the callback to this order
    return { ok: true, data: { gateway: 'khalti', action: 'REDIRECT', url: paymentUrl } };
  } catch (err) {
    markOrderFailed(order.id);
    console.error('[checkout] gateway initiation failed:', err);
    if (err instanceof PaymentConfigError) {
      // Show the specific missing-variable message in dev only.
      const msg = process.env.NODE_ENV !== 'production' ? err.message : 'This payment method is temporarily unavailable.';
      return { ok: false, error: msg, status: 503 };
    }
    return { ok: false, error: 'The payment provider is unavailable. Please try again.', status: 502 };
  }
}
