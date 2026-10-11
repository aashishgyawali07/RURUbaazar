/**
 * PURE cart logic: no React, no storage, no network.
 * The cart stores ONLY product ids and quantities. Prices/titles are looked up at
 * render time, so a stale price can never be persisted in the browser.
 */
export const MAX_QTY_PER_LINE = 10;

export interface CartLine { productId: string; quantity: number }

export type CartAction =
  | { type: 'HYDRATE'; lines: CartLine[] }
  | { type: 'ADD'; productId: string; quantity: number }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' };

const clamp = (q: number) => Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.floor(q)));

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.lines;
    case 'ADD': {
      const exists = lines.some((l) => l.productId === action.productId);
      if (!exists) return [...lines, { productId: action.productId, quantity: clamp(action.quantity) }];
      return lines.map((l) =>
        l.productId === action.productId ? { ...l, quantity: clamp(l.quantity + action.quantity) } : l);
    }
    case 'SET_QUANTITY':
      if (action.quantity < 1) return lines.filter((l) => l.productId !== action.productId);
      return lines.map((l) => (l.productId === action.productId ? { ...l, quantity: clamp(action.quantity) } : l));
    case 'REMOVE':
      return lines.filter((l) => l.productId !== action.productId);
    case 'CLEAR':
      return [];
  }
}

/** localStorage is untrusted input (users/extensions can edit it): validate before use. */
export function parseStoredLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine =>
        typeof l === 'object' && l !== null &&
        typeof (l as CartLine).productId === 'string' &&
        Number.isInteger((l as CartLine).quantity) && (l as CartLine).quantity > 0)
      .map((l) => ({ productId: l.productId, quantity: clamp(l.quantity) }));
  } catch {
    return [];
  }
}
