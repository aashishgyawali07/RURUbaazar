'use client';
/**
 * Cart state container: wires the pure reducer to React + localStorage and exposes
 * derived values (items, subtotal, count) through the useCart() hook.
 * Mounted once in app/buyer/layout.tsx so every buyer page shares one cart.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { cartReducer, parseStoredLines } from '@/lib/cart/cart-reducer';
import { getProductById } from '@/lib/mock-data';
import type { Product } from '@/types';

const STORAGE_KEY = 'marketplace.cart.v1';

export interface CartItem { product: Product; quantity: number; lineTotalNpr: number }

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalNpr: number;
  /** false during SSR/first paint; render skeletons until true to avoid hydration mismatches. */
  hydrated: boolean;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);

  // 1. Load once on the client (localStorage doesn't exist on the server).
  useEffect(() => {
    try { dispatch({ type: 'HYDRATE', lines: parseStoredLines(localStorage.getItem(STORAGE_KEY)) }); }
    catch { /* storage blocked (private mode): run with an in-memory cart */ }
    setHydrated(true);
  }, []);

  // 2. Persist on every change, but only AFTER hydration (else we'd wipe the saved cart with []).
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines, hydrated]);

  const items = useMemo<CartItem[]>(
    () => lines.flatMap((l) => {
      const product = getProductById(l.productId); // unknown ids (removed products) are dropped
      return product ? [{ product, quantity: l.quantity, lineTotalNpr: product.priceNpr * l.quantity }] : [];
    }),
    [lines],
  );

  const addItem = useCallback((productId: string, quantity = 1) => dispatch({ type: 'ADD', productId, quantity }), []);
  const setQuantity = useCallback((productId: string, quantity: number) => dispatch({ type: 'SET_QUANTITY', productId, quantity }), []);
  const removeItem = useCallback((productId: string) => dispatch({ type: 'REMOVE', productId }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotalNpr: items.reduce((sum, i) => sum + i.lineTotalNpr, 0),
    hydrated, addItem, setQuantity, removeItem, clear,
  }), [items, hydrated, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>.');
  return ctx;
}
