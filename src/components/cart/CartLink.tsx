'use client';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useCart } from './CartProvider';

/** Header cart button with item-count badge (badge hidden until hydrated to avoid a server/client mismatch). */
export function CartLink() {
  const { itemCount, hydrated } = useCart();
  const showBadge = hydrated && itemCount > 0;
  return (
    <Link href="/buyer/cart" aria-label={showBadge ? `Cart, ${itemCount} items` : 'Cart'}
          className="relative rounded-full p-2.5 text-ink hover:bg-royal-50 hover:text-royal-700">
      <Icon name="cart" className="h-6 w-6" />
      {showBadge && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold leading-none text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
