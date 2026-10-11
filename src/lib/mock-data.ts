/**
 * MOCK PRODUCT DATABASE (Phase 2).
 * Single source of truth for the catalogue until Supabase is wired up. Both the UI
 * AND the server-side checkout read prices from here via getProductById(), so the
 * checkout never trusts a price sent from the browser.
 *
 * MIGRATION: replace these functions with Supabase queries; keep the signatures.
 */
import type { Product } from '@/types';

// placehold.co serves PNG placeholders (host whitelisted in next.config.mjs).
// Colours match the placeholder brand palette in tailwind.config.js: update with your logo colours.
const placeholder = (label: string) =>
  `https://placehold.co/600x600/e3eaf5/3a5791/png?text=${encodeURIComponent(label)}`;

export const MOCK_PRODUCTS: readonly Product[] = [
  { id: 'prd-001', title: 'Hand-knitted Woollen Cap', vendorName: 'Himal Crafts', priceNpr: 850, purchaseCount: 212,
    description: 'Warm, hand-knitted cap made from locally sourced wool. Available in earthy tones.',
    imageUrl: placeholder('Woollen Cap') },
  { id: 'prd-002', title: 'Pure Himalayan Honey (500g)', vendorName: 'Mountain Hive', priceNpr: 1200, purchaseCount: 188,
    description: 'Raw, unprocessed honey collected from high-altitude hives. No additives.',
    imageUrl: placeholder('Himalayan Honey') },
  { id: 'prd-003', title: 'Ilam Orthodox Tea (250g)', vendorName: 'Ilam Leaf Co.', priceNpr: 950, purchaseCount: 164,
    description: 'Hand-rolled orthodox black tea from the hills of Ilam with a floral finish.',
    imageUrl: placeholder('Ilam Tea') },
  { id: 'prd-004', title: 'Tibetan Singing Bowl', vendorName: 'Patan Metalworks', priceNpr: 4500, purchaseCount: 97,
    description: 'Hand-hammered bronze singing bowl with wooden striker and cushion.',
    imageUrl: placeholder('Singing Bowl') },
  { id: 'prd-005', title: 'Lokta Paper Notebook Set', vendorName: 'Kathmandu Paperworks', priceNpr: 600, purchaseCount: 143,
    description: 'Set of three notebooks made from handmade lokta paper, bound by hand.',
    imageUrl: placeholder('Lokta Notebooks') },
  { id: 'prd-006', title: 'Dhaka Topi', vendorName: 'Palpa Weavers', priceNpr: 700, purchaseCount: 176,
    description: 'Traditional Nepali cap woven in classic Dhaka fabric. Sizes M, L.',
    imageUrl: placeholder('Dhaka Topi') },
  { id: 'prd-007', title: 'Pashmina Shawl', vendorName: 'Himal Crafts', priceNpr: 6800, purchaseCount: 81,
    description: 'Soft, lightweight pashmina shawl with a hand-finished fringe.',
    imageUrl: placeholder('Pashmina Shawl') },
  { id: 'prd-008', title: 'Copper Water Bottle (1L)', vendorName: 'Patan Metalworks', priceNpr: 1800, purchaseCount: 129,
    description: 'Pure copper bottle, leak-proof screw cap, traditional hammered finish.',
    imageUrl: placeholder('Copper Bottle') },
];

export function listProducts(): Product[] {
  return [...MOCK_PRODUCTS];
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
