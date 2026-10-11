/** Product data access. Reads the mock DB for now; swap bodies for Supabase queries later. */
import { listProducts } from '@/lib/mock-data';
import type { Product, ServiceResult } from '@/types';

export async function getAllProducts(): Promise<ServiceResult<Product[]>> {
  return { ok: true, data: listProducts() };
}

export async function getMostPurchased(limit = 4): Promise<ServiceResult<Product[]>> {
  const top = listProducts().sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, limit);
  return { ok: true, data: top };
}

/**
 * Case-insensitive search across title, description and vendor; every word must match.
 * PRODUCTION: replace with Postgres full-text search (to_tsvector) or pg_trgm in Supabase.
 */
export async function searchProducts(query: string): Promise<ServiceResult<Product[]>> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { ok: true, data: listProducts() };
  const hits = listProducts().filter((p) => {
    const haystack = `${p.title} ${p.description} ${p.vendorName}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
  return { ok: true, data: hits };
}
