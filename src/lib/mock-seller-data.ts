/**
 * MOCK SELLER DATA (dashboard, products, orders). Deterministic: no Math.random, no "now",
 * so server and client render identical output.
 * PRODUCTION: replace with Supabase queries scoped to the seller (RLS: seller_id = auth.uid()).
 */

// ───────────── Products ─────────────
export interface SellerProduct {
  id: string; name: string; sku: string; category: string;
  priceNpr: number; stock: number; sold: number; draft: boolean;
}
export type InventoryState = 'Active' | 'Low stock' | 'Out of stock' | 'Draft';

export const LOW_STOCK_THRESHOLD = 10;

export function inventoryState(p: SellerProduct): InventoryState {
  if (p.draft) return 'Draft';
  if (p.stock === 0) return 'Out of stock';
  if (p.stock <= LOW_STOCK_THRESHOLD) return 'Low stock';
  return 'Active';
}

export const SELLER_PRODUCTS: readonly SellerProduct[] = [
  { id: 'sp-01', name: 'Hand-knitted Woollen Cap', sku: 'HC-CAP-001', category: 'Apparel', priceNpr: 850, stock: 42, sold: 212, draft: false },
  { id: 'sp-02', name: 'Pashmina Shawl', sku: 'HC-SHL-002', category: 'Apparel', priceNpr: 6800, stock: 8, sold: 81, draft: false },
  { id: 'sp-03', name: 'Yak Wool Socks (2 pairs)', sku: 'HC-SOK-003', category: 'Apparel', priceNpr: 450, stock: 120, sold: 143, draft: false },
  { id: 'sp-04', name: 'Felt Slippers', sku: 'HC-SLP-004', category: 'Accessories', priceNpr: 1100, stock: 0, sold: 64, draft: false },
  { id: 'sp-05', name: 'Prayer Flag Set', sku: 'HC-PFL-005', category: 'Home & Decor', priceNpr: 350, stock: 75, sold: 98, draft: false },
  { id: 'sp-06', name: 'Handwoven Table Runner', sku: 'HC-TBL-006', category: 'Home & Decor', priceNpr: 1600, stock: 23, sold: 37, draft: false },
  { id: 'sp-07', name: 'Dhaka Fabric Scarf', sku: 'HC-SCF-007', category: 'Accessories', priceNpr: 1250, stock: 31, sold: 55, draft: false },
  { id: 'sp-08', name: 'Cashmere Gloves', sku: 'HC-GLV-008', category: 'Accessories', priceNpr: 1900, stock: 6, sold: 29, draft: false },
  { id: 'sp-09', name: 'Wool Blanket (Queen)', sku: 'HC-BLK-009', category: 'Home & Decor', priceNpr: 7500, stock: 12, sold: 18, draft: false },
  { id: 'sp-10', name: 'Handmade Wool Bag', sku: 'HC-BAG-010', category: 'Accessories', priceNpr: 2200, stock: 0, sold: 0, draft: true },
];

// ───────────── Orders ─────────────
export type SellerOrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export interface SellerOrderItem { title: string; quantity: number; unitPriceNpr: number }
export interface SellerOrder {
  id: string; customer: string; city: string; placedAt: string;
  items: SellerOrderItem[]; status: SellerOrderStatus; payment: 'eSewa' | 'Khalti';
}
export const orderTotal = (o: SellerOrder) => o.items.reduce((s, i) => s + i.quantity * i.unitPriceNpr, 0);

export const SELLER_ORDERS: readonly SellerOrder[] = [
  { id: 'RB-10482', customer: 'Sita Gurung', city: 'Pokhara', placedAt: '2026-10-11T09:42:00+05:45', status: 'new', payment: 'eSewa',
    items: [{ title: 'Pashmina Shawl', quantity: 1, unitPriceNpr: 6800 }] },
  { id: 'RB-10481', customer: 'Bikash Tamang', city: 'Kathmandu', placedAt: '2026-10-11T08:15:00+05:45', status: 'new', payment: 'Khalti',
    items: [{ title: 'Hand-knitted Woollen Cap', quantity: 2, unitPriceNpr: 850 }, { title: 'Yak Wool Socks (2 pairs)', quantity: 1, unitPriceNpr: 450 }] },
  { id: 'RB-10477', customer: 'Anita Shrestha', city: 'Lalitpur', placedAt: '2026-10-10T17:30:00+05:45', status: 'processing', payment: 'eSewa',
    items: [{ title: 'Wool Blanket (Queen)', quantity: 1, unitPriceNpr: 7500 }] },
  { id: 'RB-10474', customer: 'Rajan Thapa', city: 'Butwal', placedAt: '2026-10-10T11:05:00+05:45', status: 'processing', payment: 'Khalti',
    items: [{ title: 'Prayer Flag Set', quantity: 3, unitPriceNpr: 350 }, { title: 'Handwoven Table Runner', quantity: 1, unitPriceNpr: 1600 }] },
  { id: 'RB-10466', customer: 'Mina Rai', city: 'Dharan', placedAt: '2026-10-09T14:20:00+05:45', status: 'shipped', payment: 'eSewa',
    items: [{ title: 'Cashmere Gloves', quantity: 1, unitPriceNpr: 1900 }, { title: 'Dhaka Fabric Scarf', quantity: 1, unitPriceNpr: 1250 }] },
  { id: 'RB-10459', customer: 'Prakash Karki', city: 'Bharatpur', placedAt: '2026-10-08T10:40:00+05:45', status: 'delivered', payment: 'eSewa',
    items: [{ title: 'Hand-knitted Woollen Cap', quantity: 1, unitPriceNpr: 850 }] },
  { id: 'RB-10451', customer: 'Sunita Magar', city: 'Biratnagar', placedAt: '2026-10-07T16:10:00+05:45', status: 'delivered', payment: 'Khalti',
    items: [{ title: 'Pashmina Shawl', quantity: 2, unitPriceNpr: 6800 }] },
  { id: 'RB-10447', customer: 'Dipesh Adhikari', city: 'Kathmandu', placedAt: '2026-10-06T13:25:00+05:45', status: 'cancelled', payment: 'eSewa',
    items: [{ title: 'Felt Slippers', quantity: 1, unitPriceNpr: 1100 }] },
];

// ───────────── Dashboard stats ─────────────
export interface DailyRevenue { label: string; value: number }

/** 30 days ending 11 Oct 2026: upward trend + wobble + weekend lift. Deterministic. */
export const REVENUE_SERIES: readonly DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const end = Date.UTC(2026, 9, 11);
  const d = new Date(end - (29 - i) * 86_400_000);
  const base = 18_000 + i * 450;
  const wave = Math.sin(i / 2.1) * 4_200 + Math.cos(i / 4.7) * 2_600;
  const weekend = d.getUTCDay() === 5 || d.getUTCDay() === 6 ? 3_800 : 0;
  return {
    label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
    value: Math.round((base + wave + weekend) / 50) * 50,
  };
});

const revenue = REVENUE_SERIES.reduce((s, d) => s + d.value, 0);
const orderCount = 186;

export const SELLER_STATS = {
  revenue: { value: revenue, delta: 12.4 },
  orders: { value: orderCount, delta: 8.1 },
  avgOrder: { value: Math.round(revenue / orderCount), delta: 3.9 },
  visitors: { value: 4820, delta: -2.3 },
} as const;
