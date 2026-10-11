import 'server-only'; // build error if a client component ever imports this file (keeps secrets out of the browser bundle)
import { PaymentConfigError } from './errors';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  WHERE TO PUT YOUR PRODUCTION SECRET KEYS                                ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  NEVER type a secret key into source code or commit it to git.           ║
 * ║  Keys are read from ENVIRONMENT VARIABLES only:                          ║
 * ║                                                                          ║
 * ║    • Local:       .env.local   (git-ignored)                             ║
 * ║    • Production:  your host's env settings (e.g. Vercel → Project        ║
 * ║                   Settings → Environment Variables)                      ║
 * ║                                                                          ║
 * ║  Variables (see .env.example):                                           ║
 * ║    PAYMENT_ENV         sandbox | production   (default: sandbox)         ║
 * ║    ESEWA_PRODUCT_CODE  your eSewa merchant code  (sandbox: EPAYTEST)     ║
 * ║    ESEWA_SECRET_KEY    your eSewa HMAC secret    (sandbox: public docs   ║
 * ║                        key, used automatically in sandbox only)         ║
 * ║    KHALTI_SECRET_KEY   Khalti "live_secret_key" (sandbox: from your      ║
 * ║                        test-admin.khalti.com account; always required)   ║
 * ║                                                                          ║
 * ║  Do NOT prefix any of these with NEXT_PUBLIC_: that would publish them   ║
 * ║  to every visitor's browser.                                             ║
 * ║  If a production secret contains # $ & or spaces, wrap it in quotes.     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

export type PaymentEnv = 'sandbox' | 'production';

/** Anything other than the exact string "production" means sandbox, so a typo can't charge real money. */
export function getPaymentEnv(): PaymentEnv {
  return process.env.PAYMENT_ENV === 'production' ? 'production' : 'sandbox';
}

/** Skips the server-to-server status lookup. Hard-disabled in production builds. */
export function isMockVerifyEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.PAYMENT_MOCK_VERIFY === 'true';
}

/** Public base URL the gateways redirect customers back to. Must be reachable from the customer's browser. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : undefined);
  if (!url) throw new PaymentConfigError('NEXT_PUBLIC_SITE_URL is not set.');
  return url.replace(/\/$/, '');
}

// ----------------------------- eSewa ---------------------------------------
const ESEWA_DEFAULTS = {
  sandbox: {
    formUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    statusUrl: 'https://rc.esewa.com.np/api/epay/transaction/status/',
    // PUBLIC test values from eSewa's developer docs. Used ONLY when PAYMENT_ENV=sandbox.
    productCode: 'EPAYTEST',
    secretKey: '8gBm/:&EnhH.1/q',
  },
  production: {
    formUrl: 'https://epay.esewa.com.np/api/epay/main/v2/form',
    statusUrl: 'https://epay.esewa.com.np/api/epay/transaction/status/',
    productCode: undefined,
    secretKey: undefined,
  },
} as const;

export function getEsewaConfig() {
  const d = ESEWA_DEFAULTS[getPaymentEnv()];

  // ▼▼▼ PRODUCTION: set these two in your environment, not here ▼▼▼
  const productCode = process.env.ESEWA_PRODUCT_CODE ?? d.productCode;
  const secretKey = process.env.ESEWA_SECRET_KEY ?? d.secretKey;
  // ▲▲▲ ──────────────────────────────────────────────────────── ▲▲▲

  if (!productCode || !secretKey) {
    throw new PaymentConfigError('ESEWA_PRODUCT_CODE and ESEWA_SECRET_KEY must be set when PAYMENT_ENV=production.');
  }
  return {
    productCode,
    secretKey,
    formUrl: process.env.ESEWA_FORM_URL ?? d.formUrl,
    statusUrl: process.env.ESEWA_STATUS_URL ?? d.statusUrl, // eSewa's docs also list uat.esewa.com.np for sandbox; override here if rc. fails for you
  };
}

// ----------------------------- Khalti --------------------------------------
const KHALTI_BASE = {
  sandbox: 'https://dev.khalti.com/api/v2/epayment',
  production: 'https://khalti.com/api/v2/epayment',
} as const;

export function getKhaltiConfig() {
  // ▼▼▼ ALWAYS required, sandbox included. Get a sandbox key by registering a ▼▼▼
  // ▼▼▼ test merchant at https://test-admin.khalti.com                         ▼▼▼
  const secretKey = process.env.KHALTI_SECRET_KEY;
  // ▲▲▲ ──────────────────────────────────────────────────────────────────── ▲▲▲
  if (!secretKey) throw new PaymentConfigError('KHALTI_SECRET_KEY is not set.');
  return { secretKey, baseUrl: process.env.KHALTI_BASE_URL ?? KHALTI_BASE[getPaymentEnv()] };
}
