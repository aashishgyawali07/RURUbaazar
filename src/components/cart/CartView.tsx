'use client';
import Link from 'next/link';
import { useCheckout } from '@/hooks/useCheckout';
import { CartLineItem } from './CartLineItem';
import { useCart } from './CartProvider';
import { OrderSummary } from './OrderSummary';

/** Cart page body: composes line items + summary. State lives in useCart/useCheckout. */
export function CartView() {
  const cart = useCart();
  const checkout = useCheckout();

  // Wait for localStorage hydration so we don't flash "empty cart" for a split second.
  if (!cart.hydrated) {
    return <div className="h-64 animate-pulse rounded-ui bg-surface" aria-label="Loading your cart" />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-white p-12 text-center">
        <p className="font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-ink-soft">Browse products and add something you like.</p>
        <Link href="/buyer" className="mt-5 inline-block rounded-ui bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-label="Items in your cart">
        <ul className="divide-y divide-surface-border rounded-2xl border border-surface-border bg-white px-5 shadow-card">
          {cart.items.map((item) => (
            <CartLineItem key={item.product.id} item={item} onQuantityChange={cart.setQuantity} onRemove={cart.removeItem} />
          ))}
        </ul>
        <button type="button" onClick={cart.clear} className="mt-3 text-sm text-ink-soft hover:underline">Clear cart</button>
      </section>

      <OrderSummary
        itemCount={cart.itemCount}
        subtotalNpr={cart.subtotalNpr}
        gateway={checkout.gateway}
        onGatewayChange={checkout.setGateway}
        onProceed={() => checkout.proceedToPayment(cart.items)}
        submitting={checkout.submitting}
        error={checkout.error}
      />
    </div>
  );
}
