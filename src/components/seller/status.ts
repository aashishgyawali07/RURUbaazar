import type { BadgeTone } from '@/components/ui/Badge';
import type { InventoryState, SellerOrderStatus } from '@/lib/mock-seller-data';

export const ORDER_STATUS: Record<SellerOrderStatus, { label: string; tone: BadgeTone }> = {
  new:        { label: 'New',        tone: 'brand' },
  processing: { label: 'Processing', tone: 'royal' },
  shipped:    { label: 'Shipped',    tone: 'warning' },
  delivered:  { label: 'Delivered',  tone: 'success' },
  cancelled:  { label: 'Cancelled',  tone: 'neutral' },
};

export const INVENTORY_TONE: Record<InventoryState, BadgeTone> = {
  Active: 'success', 'Low stock': 'warning', 'Out of stock': 'danger', Draft: 'neutral',
};

export const fmtOrderDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kathmandu' }).format(new Date(iso));
