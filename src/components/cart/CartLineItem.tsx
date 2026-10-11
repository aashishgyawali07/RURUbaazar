'use client';
import Image from 'next/image';
import { MAX_QTY_PER_LINE } from '@/lib/cart/cart-reducer';
import { formatNpr } from '@/lib/format';
import type { CartItem } from './CartProvider';

interface Props {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

/** One row in the cart. Presentational: all mutations go through the callbacks. */
export function CartLineItem({ item, onQuantityChange, onRemove }: Props) {
  const { product, quantity, lineTotalNpr } = item;
  return (
    <li className="flex gap-4 py-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-ui bg-surface-muted">
        <Image src={product.imageUrl} alt={product.title} fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-medium">{product.title}</h3>
            <p className="text-xs text-ink-soft">{product.vendorName} · {formatNpr(product.priceNpr)} each</p>
          </div>
          <p className="font-semibold">{formatNpr(lineTotalNpr)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center rounded-ui border border-surface-border">
            <button type="button" aria-label={`Decrease quantity of ${product.title}`}
                    onClick={() => onQuantityChange(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-lg leading-none hover:bg-surface-muted">−</button>
            <span className="min-w-8 text-center text-sm" aria-live="polite">{quantity}</span>
            <button type="button" aria-label={`Increase quantity of ${product.title}`}
                    disabled={quantity >= MAX_QTY_PER_LINE}
                    onClick={() => onQuantityChange(product.id, quantity + 1)}
                    className="px-3 py-1.5 text-lg leading-none hover:bg-surface-muted disabled:opacity-40">+</button>
          </div>
          <button type="button" onClick={() => onRemove(product.id)}
                  className="text-sm text-danger hover:underline">Remove</button>
        </div>
      </div>
    </li>
  );
}
