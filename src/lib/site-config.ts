/**
 * SINGLE SOURCE OF TRUTH for brand + contact details.
 * Edit here; header, footer, metadata and the contact page all read from it.
 */
export const SITE = {
  name: 'RURUbaazar',
  tagline: 'Authentic products from trusted Nepali sellers',
  // The trimmed logo lives at public/RURUbaazar.png (1200×213). If you swap the file for a
  // different aspect ratio, update width/height so next/image reserves the correct space.
  logo: { src: '/RURUbaazar.png', width: 1200, height: 213 },
  // TODO: replace every value below with your real details before launch.
  support: {
    email: 'support@rurubaazar.com',
    phone: '+977 98XXXXXXXX',
    hours: 'Sun – Fri, 9:00 AM – 6:00 PM (NPT)',
    address: 'Your business address, Nepal',
  },
} as const;
