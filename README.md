# Marketplace: Phase 1 scaffold

Setup: `npm install`, copy `.env.example` to `.env.local`, enable Google + Facebook providers in Supabase Auth, then `npm run dev`.

## Architecture rule
UI components (`components/`) never import Supabase. Flow is:
`component → hook (state/validation) → service (Supabase calls) → lib/supabase`

## Phase 2: testing payments locally
- eSewa sandbox needs no keys. Test login: ID 9806800001 (…2/3/4/5), password `Nepal@123`, token `123456`.
- Khalti sandbox needs `KHALTI_SECRET_KEY` from test-admin.khalti.com. Test ID 9800000000 (…1–5); see Khalti docs for test MPIN/OTP.
- Orders live in memory (`lib/mock-orders.ts`): restarting `npm run dev` between paying and returning loses the order.

## Phase 3: UI/UX overhaul
- **Logo:** `public/RURUbaazar.png` is a TRIMMED copy of the original (3000×3000 with ~86% empty margin → 1200×213). If you replace it, crop the margins too, and update `SITE.logo` in `src/lib/site-config.ts` if the aspect ratio changes.
- **Brand colours:** all in `tailwind.config.js` (`brand` red, `accent` orange, `royal` purple). Components use only these tokens.
- **Contact / brand details:** edit `src/lib/site-config.ts` (placeholders marked TODO).
- **New routes:** `/seller/dashboard`, `/seller/products`, `/seller/products/new`, `/seller/orders`, `/buyer/search`, `/buyer/orders`. `/seller` redirects to the dashboard.
- Seller data is mock (`lib/mock-seller-data.ts`); see service files for the Supabase migration notes.
