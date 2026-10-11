/**
 * Shared payment types. TYPES ONLY: safe to import from client code.
 * (Runtime payment code lives in sibling files that are `server-only`.)
 */
export type PaymentGateway = 'esewa' | 'khalti';

/** What the browser must do next to reach the gateway's payment page. */
export type PaymentInitiation =
  // eSewa ePay v2: browser must POST these fields to `url` (a plain redirect isn't enough).
  | { gateway: 'esewa'; action: 'POST_FORM'; url: string; fields: Record<string, string> }
  // Khalti: browser simply navigates to `url` (the payment_url returned by Khalti).
  | { gateway: 'khalti'; action: 'REDIRECT'; url: string };

/** JSON shape returned by POST /api/checkout. */
export type CheckoutApiResponse =
  | ({ ok: true } & PaymentInitiation)
  | { ok: false; error: string };
