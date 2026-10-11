'use client';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatNpr } from '@/lib/format';
import { inventoryState, type InventoryState, type SellerProduct } from '@/lib/mock-seller-data';
import { INVENTORY_TONE } from './status';

const FILTERS: ('All' | InventoryState)[] = ['All', 'Active', 'Low stock', 'Out of stock', 'Draft'];

/** Searchable, filterable product list: real table on md+, stacked cards on mobile. */
export function ProductsTable({ products }: { products: readonly SellerProduct[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) =>
      (filter === 'All' || inventoryState(p) === filter) &&
      (!q || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q)));
  }, [products, query, filter]);

  return (
    <div className="rounded-2xl border border-surface-border bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-surface-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-80">
          <span className="sr-only">Search products</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, SKU or category"
                 className="w-full rounded-ui border border-surface-border py-2.5 pl-9 pr-3 text-sm placeholder:text-ink-faint focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-200" />
        </label>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors
                      ${filter === f ? 'bg-royal-600 text-white' : 'bg-surface-muted text-ink-soft hover:bg-royal-50 hover:text-royal-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="p-12 text-center text-sm text-ink-soft">No products match your filters.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Your products</caption>
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-soft">
                <tr>{['Product', 'Category', 'Price', 'Stock', 'Sold', 'Status'].map((h, i) => <th key={h} scope="col" className={`px-5 py-3 font-semibold ${i >= 2 && i <= 4 ? 'text-right' : ''}`}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rows.map((p) => {
                  const state = inventoryState(p);
                  return (
                    <tr key={p.id} className="hover:bg-royal-50/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-50 font-display font-bold text-royal-700">{p.name[0]}</span>
                          <div className="min-w-0"><p className="truncate font-medium">{p.name}</p><p className="font-mono text-xs text-ink-soft">{p.sku}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">{p.category}</td>
                      <td className="px-5 py-3.5 text-right font-medium">{formatNpr(p.priceNpr)}</td>
                      <td className="px-5 py-3.5 text-right">{p.stock}</td>
                      <td className="px-5 py-3.5 text-right">{p.sold}</td>
                      <td className="px-5 py-3.5"><Badge tone={INVENTORY_TONE[state]}>{state}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-surface-border md:hidden">
            {rows.map((p) => {
              const state = inventoryState(p);
              return (
                <li key={p.id} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="font-medium">{p.name}</p><p className="font-mono text-xs text-ink-soft">{p.sku} · {p.category}</p></div>
                    <Badge tone={INVENTORY_TONE[state]}>{state}</Badge>
                  </div>
                  <dl className="flex gap-6 text-sm">
                    <div><dt className="text-xs text-ink-soft">Price</dt><dd className="font-semibold">{formatNpr(p.priceNpr)}</dd></div>
                    <div><dt className="text-xs text-ink-soft">Stock</dt><dd className="font-semibold">{p.stock}</dd></div>
                    <div><dt className="text-xs text-ink-soft">Sold</dt><dd className="font-semibold">{p.sold}</dd></div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <p className="border-t border-surface-border px-5 py-3 text-xs text-ink-soft" aria-live="polite">Showing {rows.length} of {products.length} products</p>
    </div>
  );
}
