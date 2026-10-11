/**
 * PURE validation functions: no React, no network. Trivially unit-testable.
 * Rules assume Nepal (PAN = 9 digits; mobile = 97/98 + 8 digits). Adjust here only.
 */
export interface SellerFormValues {
  storeName: string;
  panNumber: string;
  contactNumber: string;
  email: string;
}
export type SellerFileKey = 'panImage' | 'citizenshipFront' | 'citizenshipBack';
export type SellerFiles = Record<SellerFileKey, File | null>;
export type SellerErrors = Partial<Record<keyof SellerFormValues | SellerFileKey, string>>;

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFile(file: File | null): string | undefined {
  if (!file) return 'This document is required.';
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) return 'Upload a JPG, PNG or WebP image.';
  if (file.size > MAX_FILE_BYTES) return 'File must be 5 MB or smaller.';
}

export function validateSeller(v: SellerFormValues, f: SellerFiles): SellerErrors {
  const e: SellerErrors = {};
  if (v.storeName.trim().length < 3) e.storeName = 'Store name must be at least 3 characters.';
  if (!/^\d{9}$/.test(v.panNumber)) e.panNumber = 'PAN must be exactly 9 digits.';
  if (!/^(97|98)\d{8}$/.test(v.contactNumber)) e.contactNumber = 'Enter a 10-digit mobile number starting with 97 or 98.';
  if (!EMAIL_RE.test(v.email)) e.email = 'Enter a valid email address.';
  (Object.keys(f) as SellerFileKey[]).forEach((k) => {
    const msg = validateFile(f[k]);
    if (msg) e[k] = msg;
  });
  return e;
}
