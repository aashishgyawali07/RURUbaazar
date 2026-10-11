import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClearCartOnSuccess } from '@/components/payment/ClearCartOnSuccess';
import { PaymentResultCard } from '@/components/payment/PaymentResultCard';
import { getCurrentBuyer } from '@/lib/auth/current-user';
import { formatNpr } from '@/lib/format';
import { verifyPaymentCallback } from '@/services/payment-verification.service';

export const metadata: Metadata = { title: 'Payment status' };
export const dynamic = 'force-dynamic'; // verification must run on every request, never from cache

const linkBtn = 'rounded-ui px-5 py-2.5 text-sm font-medium';

/**
 * Landing page for BOTH gateways (eSewa appends ?data=…, Khalti appends ?pidx=…).
 * Verification happens on the server BEFORE any success UI is rendered.
 */
export default async function PaymentSuccessPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const buyer = await getCurrentBuyer();
  if (!buyer) redirect('/auth');

  const outcome = await verifyPaymentCallback(await searchParams, buyer.id);

  if (outcome.kind === 'success') {
    const { order, paymentRef } = outcome;
    return (
      <main className="px-4 py-12">
        <ClearCartOnSuccess />
        <PaymentResultCard tone="success" title="Payment successful"
          message={outcome.alreadyProcessed ? 'This payment was already confirmed. Here are your order details.' : 'Thank you! Your order has been confirmed.'}>
          <dl className="mt-6 space-y-2 border-t border-surface-border pt-4 text-left text-sm">
            {order.items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-4">
                <dt className="min-w-0 truncate">{i.title} × {i.quantity}</dt>
                <dd>{formatNpr(i.unitPriceNpr * i.quantity)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-surface-border pt-2 font-semibold"><dt>Total paid</dt><dd>{formatNpr(order.totalNpr)}</dd></div>
            <div className="flex justify-between text-xs text-ink-soft"><dt>Payment reference</dt><dd className="font-mono">{paymentRef}</dd></div>
            <div className="flex justify-between text-xs text-ink-soft"><dt>Order ID</dt><dd className="font-mono">{order.id.slice(0, 8)}</dd></div>
          </dl>
          <Link href="/buyer" className={`${linkBtn} mt-6 inline-block bg-brand-600 text-white hover:bg-brand-700`}>Continue shopping</Link>
        </PaymentResultCard>
      </main>
    );
  }

  const view = {
    pending: { tone: 'warning' as const, title: 'Confirming your payment' },
    failed:  { tone: 'danger' as const,  title: 'Payment not completed' },
    invalid: { tone: 'danger' as const,  title: 'We couldn’t verify this payment' },
  }[outcome.kind];

  return (
    <main className="px-4 py-12">
      <PaymentResultCard tone={view.tone} title={view.title} message={outcome.message}>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/buyer/cart" className={`${linkBtn} bg-brand-600 text-white hover:bg-brand-700`}>Back to cart</Link>
          <Link href="/contact" className={`${linkBtn} border border-surface-border hover:bg-surface-muted`}>Contact support</Link>
        </div>
      </PaymentResultCard>
    </main>
  );
}
