import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = { title: 'Your cart' };

export default function CartPage() {
  return (
    <main className="container-page py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">Your cart</h1>
      <CartView />
    </main>
  );
}
