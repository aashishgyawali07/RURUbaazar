/** Roles stored in Supabase `auth.users.raw_user_meta_data.role` AND in `profiles.role`. */
export type UserRole = 'buyer' | 'seller' | 'admin';

export type OAuthProvider = 'google' | 'facebook';

/** Uniform result type: services never throw to the UI; they return this. */
export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Catalogue product. Prices are whole NPR (rupees) in this mock layer.
 * When you move to Supabase, store money as integer paisa (NPR x 100) to avoid float drift.
 */
export interface Product {
  id: string;
  title: string;
  description: string;
  priceNpr: number;
  imageUrl: string;
  vendorName: string;
  purchaseCount: number; // drives "Latest Most Purchased"
}
