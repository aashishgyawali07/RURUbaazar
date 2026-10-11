'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNpr } from '@/lib/format';
import { orderTotal, type SellerOrder, type SellerOrderStatus } from '@/lib/mock-seller-data';
import { ORDER_STATUS, fmtOrderDate } from './status';

const TABS: ('all' | SellerOrderStatus)[] = ['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'];

// What the primary action does for each status (null = nothing more to do).
const NEXT: Partial<Record<SellerOrderStatus, { label: string; to: SellerOrderStatus }>> = {
  new: { label: 'Accept order', to: 'processing' },
  processing: { label: 'Mark as shipped', to: 'shipped' },
  shipped: { label: 'Mark as delivered', to: 'delivered' },
};

/** Incoming orders with status tabs. Status changes live in local state only (mock). */
export function SellerOrdersList({ initial }: { initial: readonly SellerOrder[] }) {
  const [orders, setOrders] = useState<SellerOrder[]>([...initial]);
  const [tab, setTab] = useState<(typeof TABS)[number]>('all');
  const [announce, setAnnounce] = useState('');

  const setStatus = (id: string, status: SellerOrderStatus) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setAnnounce(`Order ${id} is now ${ORDER_STATUS[status].label.toLowerCase()}.`);
  };
  const count = (t: (typeof TABS)[number]) => (t === 'all' ? orders.length : orders.filter((o) => o.status === t).length);
  const visible = tab === 'all' ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Filter orders" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors
                    ${tab === t ? 'bg-royal-600 text-white' : 'bg-white text-ink-soft ring-1 ring-inset ring-surface-border hover:bg-royal-50 hover:text-royal-700'}`}>
            {t} <span className={tab === t ? 'text-royal-200' : 'text-ink-faint'}>({count(t)})</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-surface-border bg-white p-12 text-center text-sm text-ink-soft">No orders in this view.</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((o) => {
            const next = NEXT[o.status];
            return (
              <li key={o.id} className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold">{o.id}</p>
                    <p className="text-sm">{o.customer} <span className="text-ink-soft">· {o.city}</span></p>
                    <p className="text-xs text-ink-soft">{fmtOrderDate(o.placedAt)} · Paid via {o.payment}</p>
                  </div>
                  <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-surface-border pt-4 text-sm">
                  {o.items.map((i) => (
                    <li key={i.title} className="flex justify-between gap-4"><span className="min-w-0 truncate">{i.title} × {i.quantity}</span><span>{formatNpr(i.quantity * i.unitPriceNpr)}</span></li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-4">
                  <p className="font-semibold">Total <span className="ml-2 text-brand-700">{formatNpr(orderTotal(o))}</span></p>
                  <div className="flex gap-2">
                    {o.status === 'new' && <Button variant="secondary" size="sm" onClick={() => setStatus(o.id, 'cancelled')}>Decline</Button>}
                    {next && <Button size="sm" onClick={() => setStatus(o.id, next.to)}>{next.label}</Button>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
