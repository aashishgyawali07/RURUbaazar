import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { RevenueChart } from '@/components/seller/RevenueChart';
import { SellerPageHeader } from '@/components/seller/SellerPageHeader';
import { StatCard } from '@/components/seller/StatCard';
import { INVENTORY_TONE, ORDER_STATUS, fmtOrderDate } from '@/components/seller/status';
import { formatNpr } from '@/lib/format';
import {
  REVENUE_SERIES, SELLER_ORDERS, SELLER_PRODUCTS, SELLER_STATS, inventoryState, orderTotal,
} from '@/lib/mock-seller-data';

export const metadata: Metadata = { title: 'Seller dashboard' };

const card = 'rounded-2xl border border-surface-border bg-white p-5 shadow-card sm:p-6';

export default function SellerDashboardPage() {
  const s = SELLER_STATS;
  const topProducts = [...SELLER_PRODUCTS].filter((p) => !p.draft).sort((a, b) => b.sold * b.priceNpr - a.sold * a.priceNpr).slice(0, 5);
  const topRevenue = topProducts[0].sold * topProducts[0].priceNpr;
  const recent = SELLER_ORDERS.slice(0, 5);
  const needsAttention = SELLER_PRODUCTS.filter((p) => ['Low stock', 'Out of stock'].includes(inventoryState(p)));

  return (
    <main className="container-page space-y-8 py-8">
      <SellerPageHeader
        title="Dashboard"
        description="How your store performed over the last 30 days."
        actions={<><Badge tone="neutral">Sample data</Badge><Link href="/seller/products/new" className={buttonClasses({ size: 'sm' })}><Icon name="plus" className="h-4 w-4" /> Add product</Link></>}
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatNpr(s.revenue.value)} delta={s.revenue.delta} icon="wallet" />
        <StatCard label="Orders" value={s.orders.value.toLocaleString('en-NP')} delta={s.orders.delta} icon="package" />
        <StatCard label="Avg. order value" value={formatNpr(s.avgOrder.value)} delta={s.avgOrder.delta} icon="trending-up" />
        <StatCard label="Store visits" value={s.visitors.value.toLocaleString('en-NP')} delta={s.visitors.delta} icon="eye" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`} aria-labelledby="rev-heading">
          <h2 id="rev-heading" className="font-display text-xl font-bold">Revenue</h2>
          <p className="mb-4 text-sm text-ink-soft">Daily sales, last 30 days</p>
          <RevenueChart data={REVENUE_SERIES} />
        </section>

        <section className={card} aria-labelledby="top-heading">
          <h2 id="top-heading" className="font-display text-xl font-bold">Top products</h2>
          <p className="mb-4 text-sm text-ink-soft">By revenue</p>
          <ol className="space-y-4">
            {topProducts.map((p, i) => {
              const rev = p.sold * p.priceNpr;
              return (
                <li key={p.id}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium"><span className="mr-2 text-ink-soft">{i + 1}.</span>{p.name}</span>
                    <span className="shrink-0 font-semibold">{formatNpr(rev)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-royal-50" role="presentation">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${Math.round((rev / topRevenue) * 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`} aria-labelledby="recent-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-heading" className="font-display text-xl font-bold">Recent orders</h2>
            <Link href="/seller/orders" className="text-sm font-semibold text-royal-700 hover:text-brand-600">View all →</Link>
          </div>
          <ul className="divide-y divide-surface-border">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">{o.id}</p>
                  <p className="truncate text-xs text-ink-soft">{o.customer} · {fmtOrderDate(o.placedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                  <span className="w-24 text-right text-sm font-semibold">{formatNpr(orderTotal(o))}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-labelledby="stock-heading">
          <h2 id="stock-heading" className="font-display text-xl font-bold">Needs attention</h2>
          <p className="mb-4 text-sm text-ink-soft">Restock soon to avoid lost sales</p>
          <ul className="space-y-3">
            {needsAttention.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{p.name}</span>
                <Badge tone={INVENTORY_TONE[inventoryState(p)]}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</Badge>
              </li>
            ))}
          </ul>
          <Link href="/seller/products" className={buttonClasses({ variant: 'secondary', size: 'sm', className: 'mt-5 w-full' })}>Manage inventory</Link>
        </section>
      </div>
    </main>
  );
}
