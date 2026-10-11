'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { formatNpr } from '@/lib/format';
import type { Product } from '@/types';

const BESTSELLER_THRESHOLD = 170; // purchaseCount at/above which the badge shows

/** Product card with Add to Cart. Used by the "most purchased" rail, the main grid and search results. */
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleAdd() {
    addItem(product.id);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-royal-50">
        <Image src={product.imageUrl} alt={product.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
               className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.purchaseCount >= BESTSELLER_THRESHOLD && <span className="absolute left-3 top-3"><Badge tone="brand">Bestseller</Badge></span>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold text-royal-700">{product.vendorName}</p>
        <h3 className="font-semibold leading-snug">{product.title}</h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-lg font-bold text-brand-700">{formatNpr(product.priceNpr)}</p>
          <button type="button" onClick={handleAdd} className={buttonClasses({ size: 'sm' })}>
            <Icon name={justAdded ? 'check' : 'cart'} className="h-4 w-4" />
            {justAdded ? 'Added' : 'Add to Cart'}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">{justAdded ? `${product.title} added to cart` : ''}</span>
      </div>
    </article>
  );
}
