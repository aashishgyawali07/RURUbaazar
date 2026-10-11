'use client';
import { useEffect } from 'react';
import { useCart } from '@/components/cart/CartProvider';

/** Empties the cart once payment is verified. Renders nothing. (Clearing earlier would lose the cart if the user abandons payment.) */
export function ClearCartOnSuccess() {
  const { clear, hydrated } = useCart();
  useEffect(() => { if (hydrated) clear(); }, [hydrated, clear]);
  return null;
}
