import { NextResponse } from 'next/server';
import { getCurrentBuyer } from '@/lib/auth/current-user';
import type { CheckoutApiResponse } from '@/lib/payments/types';
import { initiateCheckout } from '@/services/checkout.service';

/**
 * POST /api/checkout: starts a payment.
 *
 * Request : { gateway: 'esewa' | 'khalti', items: [{ productId, quantity }] }
 * Response: eSewa  → { ok, gateway, action: 'POST_FORM', url, fields }  (browser POSTs the form)
 *           Khalti → { ok, gateway, action: 'REDIRECT',  url }          (browser navigates)
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ SECRET KEYS: nothing secret lives in this file. The eSewa HMAC secret    │
 * │ and Khalti secret key are read from environment variables inside         │
 * │ src/lib/payments/config.ts. Read the banner at the top of that file.     │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Thin by design: auth + HTTP concerns here, all rules in checkout.service.ts.
 * PRODUCTION TODO: add rate limiting (e.g. Upstash Ratelimit) keyed by user id.
 */
export const runtime = 'nodejs'; // we use node:crypto
const json = (body: CheckoutApiResponse, status = 200) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  // CSRF defence-in-depth: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) {
    return json({ ok: false, error: 'Forbidden.' }, 403);
  }

  const buyer = await getCurrentBuyer();
  if (!buyer) return json({ ok: false, error: 'Please log in to continue.' }, 401);

  let body: { gateway?: unknown; items?: unknown };
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Invalid request.' }, 400); }

  const result = await initiateCheckout({ buyerId: buyer.id, gateway: body.gateway, items: body.items });
  return result.ok
    ? json({ ok: true, ...result.data })
    : json({ ok: false, error: result.error }, result.status);
}
