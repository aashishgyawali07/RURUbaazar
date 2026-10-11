/**
 * SELLER PRODUCT SERVICE (mock).
 * PRODUCTION: upload the image to a Supabase Storage bucket (public-read, e.g. 'product-images',
 * path `<seller_id>/<uuid>.<ext>`), then insert into `products` with seller_id = auth.uid().
 * Re-validate everything server-side; never trust client validation.
 */
import type { ProductFormValues } from '@/lib/validation/product';
import type { ServiceResult } from '@/types';

export async function createProduct(values: ProductFormValues, image: File): Promise<ServiceResult<{ id: string }>> {
  await new Promise((r) => setTimeout(r, 900));
  console.info('[mock] create product', values, image.name);
  return { ok: true, data: { id: `mock-${Date.now()}` } };
}
