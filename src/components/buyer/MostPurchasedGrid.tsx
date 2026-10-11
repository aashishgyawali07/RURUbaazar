import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

/** "Latest Most Purchased": horizontal scroll-snap rail on mobile, 4-column grid from lg up. */
export function MostPurchasedGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="most-purchased-heading" className="space-y-6">
      <SectionHeading id="most-purchased-heading" eyebrow="Trending now" title="Latest most purchased" />
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6
                     lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {products.map((p) => <li key={p.id} className="w-64 shrink-0 snap-start lg:w-auto"><ProductCard product={p} /></li>)}
      </ul>
    </section>
  );
}
