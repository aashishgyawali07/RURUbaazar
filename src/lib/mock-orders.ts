import 'server-only';
import type { PaymentGateway } from '@/lib/payments/types';

/**
 * MOCK ORDERS DATABASE (in-memory, server only).
 *
 * Replace with a Supabase `orders` + `order_items` table. Required behaviour to keep:
 *  - `markOrderPaid` must be an ATOMIC conditional update (…WHERE status = 'pending'),
 *    so two simultaneous callbacks can't both "win".
 *  - RLS: buyers may SELECT only their own rows; only the service role may UPDATE status.
 *
 * Stored on globalThis so it survives Next.js dev hot-reloads and is shared between
 * the API route and the server-rendered pages. It is wiped when the server restarts.
 */
export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem { productId: string; title: string; unitPriceNpr: number; quantity: number }

export interface Order {
  id: string;
  buyerId: string;
  gateway: PaymentGateway;
  items: OrderItem[];
  totalNpr: number;
  status: OrderStatus;
  gatewayRef: string | null; // Khalti: pidx
  paymentRef: string | null; // eSewa transaction_code / Khalti transaction_id (set when paid)
  createdAt: string;
  paidAt: string | null;
}

const g = globalThis as unknown as { __mockOrders?: Map<string, Order> };
const store = (g.__mockOrders ??= new Map<string, Order>());

export function createOrder(input: Pick<Order, 'id' | 'buyerId' | 'gateway' | 'items' | 'totalNpr'>): Order {
  const order: Order = { ...input, status: 'pending', gatewayRef: null, paymentRef: null, createdAt: new Date().toISOString(), paidAt: null };
  store.set(order.id, order);
  return order;
}

export const getOrder = (id: string): Order | undefined => store.get(id);

export function attachGatewayRef(id: string, ref: string): void {
  const o = store.get(id);
  if (o) o.gatewayRef = ref;
}

/** Idempotent: a repeat call on an already-paid order changes nothing. */
export function markOrderPaid(id: string, paymentRef: string): Order | undefined {
  const o = store.get(id);
  if (!o || o.status === 'paid') return o;
  o.status = 'paid';
  o.paymentRef = paymentRef;
  o.paidAt = new Date().toISOString();
  return o;
}

export function markOrderFailed(id: string): void {
  const o = store.get(id);
  if (o && o.status === 'pending') o.status = 'failed'; // never downgrade a paid order
}

/** A buyer's orders, newest first. (Supabase: select … where buyer_id = auth.uid() order by created_at desc.) */
export function listOrdersByBuyer(buyerId: string): Order[] {
  return [...store.values()]
    .filter((o) => o.buyerId === buyerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
