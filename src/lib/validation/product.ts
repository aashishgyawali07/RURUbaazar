/** PURE validation for the seller "Add product" form. */
export const PRODUCT_CATEGORIES = ['Apparel', 'Home & Decor', 'Food & Tea', 'Crafts', 'Accessories'] as const;
export const PRODUCT_STATUSES = ['Active', 'Draft'] as const;

export interface ProductFormValues {
  name: string; category: string; priceNpr: string; stock: string; description: string; status: string;
}
export type ProductErrors = Partial<Record<keyof ProductFormValues | 'image', string>>;

export function validateProduct(v: ProductFormValues, image: File | null, validateImage: (f: File | null) => string | undefined): ProductErrors {
  const e: ProductErrors = {};
  if (v.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
  const price = Number(v.priceNpr);
  if (!Number.isInteger(price) || price < 1 || price > 1_000_000) e.priceNpr = 'Enter a price between NPR 1 and 1,000,000.';
  const stock = Number(v.stock);
  if (v.stock === '' || !Number.isInteger(stock) || stock < 0 || stock > 100_000) e.stock = 'Enter a stock quantity (0 or more).';
  if (v.description.trim().length < 20) e.description = 'Describe the product in at least 20 characters.';
  const imgErr = validateImage(image);
  if (imgErr) e.image = imgErr;
  return e;
}
