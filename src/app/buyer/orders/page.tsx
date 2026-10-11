import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { getCurrentBuyer } from '@/lib/auth/current-user';
import { formatNpr } from '@/lib/format';
import { listOrdersByBuyer, type OrderStatus } from '@/lib/mock-orders';

export const metadata: Metadata = { title: 'My orders' };
export const dynamic = 'force-dynamic'; // always read fresh order state

const STATUS: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  paid: { label: 'Paid', tone: 'success' },
  pending: { label: 'Awaiting payment', tone: 'warning' },
  failed: { label: 'Payment failed', tone: 'danger' },
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kathmandu' }).format(new Date(iso));

export default async function BuyerOrdersPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) redirect('/auth?next=/buyer/orders');
  const orders = listOrdersByBuyer(buyer.id);

  return (
    <main className="container-page max-w-4xl space-y-6 py-8">
      <h1 className="font-display text-3xl font-bold">My orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-white p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-royal-50 text-royal-700"><Icon name="package" className="h-7 w-7" /></span>
          <p className="mt-4 font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-ink-soft">When you place an order, it will show up here.</p>
          <Link href="/buyer" className={buttonClasses({ className: 'mt-6' })}>Start shopping</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold">#{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-ink-soft">{fmtDate(o.createdAt)} · {o.gateway === 'esewa' ? 'eSewa' : 'Khalti'}</p>
                </div>
                <Badge tone={STATUS[o.status].tone}>{STATUS[o.status].label}</Badge>
              </div>
              <ul className="mt-4 space-y-1.5 border-t border-surface-border pt-4 text-sm">
                {o.items.map((i) => (
                  <li key={i.productId} className="flex justify-between gap-4"><span className="min-w-0 truncate">{i.title} × {i.quantity}</span><span>{formatNpr(i.unitPriceNpr * i.quantity)}</span></li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-surface-border pt-3 font-semibold"><span>Total</span><span>{formatNpr(o.totalNpr)}</span></p>
            </li>
          ))}
        </ul>
      )}

      {process.env.NODE_ENV !== 'production' && (
        <p className="text-xs text-ink-soft">Dev note: orders are held in server memory and disappear when the dev server restarts.</p>
      )}
    </main>
  );
}
