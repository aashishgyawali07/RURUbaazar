import type { Metadata } from 'next';
import Link from 'next/link';
import { GlobalSearchBar } from '@/components/buyer/GlobalSearchBar';
import { ProductGrid } from '@/components/buyer/ProductGrid';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { searchProducts } from '@/services/product.service';

export const metadata: Metadata = { title: 'Search' };

const SUGGESTIONS = ['Honey', 'Tea', 'Pashmina', 'Copper'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? '').trim().slice(0, 80); // cap length: it's user input
  const res = await searchProducts(query);
  const products = res.ok ? res.data : [];

  return (
    <main className="container-page space-y-8 py-8">
      <GlobalSearchBar defaultValue={query} className="max-w-2xl" />

      <p className="text-sm text-ink-soft" aria-live="polite">
        {query ? <>{products.length} result{products.length === 1 ? '' : 's'} for <strong className="text-ink">“{query}”</strong></> : 'Showing all products'}
      </p>

      {products.length > 0 ? <ProductGrid products={products} /> : (
        <div className="rounded-2xl border border-dashed border-surface-border bg-white p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-royal-50 text-royal-700"><Icon name="search" className="h-7 w-7" /></span>
          <h1 className="mt-4 font-display text-2xl font-bold">No matches found</h1>
          <p className="mt-1 text-sm text-ink-soft">Check the spelling or try one of these:</p>
          <p className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => <Link key={s} href={`/buyer/search?q=${s}`} className="rounded-full border border-surface-border px-3.5 py-1.5 text-sm font-medium hover:border-royal-300 hover:bg-royal-50">{s}</Link>)}
          </p>
          <Link href="/buyer" className={buttonClasses({ className: 'mt-6' })}>Browse all products</Link>
        </div>
      )}
    </main>
  );
}
