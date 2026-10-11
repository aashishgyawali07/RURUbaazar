import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

/** Responsive grid: 1 col (mobile) → 2 (sm) → 3 (lg) → 4 (xl). Server-renderable; cards are client islands. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
    </ul>
  );
}
