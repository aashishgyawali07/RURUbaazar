import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getEsewaConfig, getSiteUrl } from './config';

/**
 * eSewa ePay v2 adapter.
 *
 * FLOW
 *  1. Server builds + SIGNS the form fields (buildEsewaFormPayload).
 *  2. Browser POSTs them to eSewa (eSewa's v2 endpoint takes a form POST, so we return
 *     the fields rather than a bare URL; see lib/dom/submit-form.ts).
 *  3. On success eSewa redirects to success_url?data=<base64 JSON> (decodeEsewaCallback).
 *  4. Server verifies the callback signature (verifyEsewaSignature) AND confirms with
 *     eSewa's status API (lookupEsewaStatus). Only then is the order marked paid.
 */

/** HMAC-SHA256 → base64, exactly as eSewa specifies. */
export function signMessage(message: string, secretKey: string): string {
  return createHmac('sha256', secretKey).update(message).digest('base64');
}

/** The SAME string must be used in the signature, the form field and the status-API call. */
export function formatAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function buildEsewaFormPayload(args: { orderId: string; totalNpr: number }) {
  const cfg = getEsewaConfig();
  const site = getSiteUrl();
  const total = formatAmount(args.totalNpr);

  // Field order and spelling matter: eSewa rebuilds this exact string to check the signature.
  const signedFieldNames = 'total_amount,transaction_uuid,product_code';
  const message = `total_amount=${total},transaction_uuid=${args.orderId},product_code=${cfg.productCode}`;
  const signature = signMessage(message, cfg.secretKey);

  return {
    url: cfg.formUrl,
    fields: {
      amount: total,                    // price of goods
      tax_amount: '0',                  // all four must be present, "0" if unused
      product_service_charge: '0',
      product_delivery_charge: '0',
      total_amount: total,              // MUST equal amount + tax + service + delivery
      transaction_uuid: args.orderId,   // unique per attempt; letters, digits, hyphen only
      product_code: cfg.productCode,    // your merchant code
      // Keep these WITHOUT query strings: eSewa appends "?data=..." itself.
      success_url: `${site}/buyer/payment-success`,
      failure_url: `${site}/buyer/payment-failed`,
      signed_field_names: signedFieldNames,
      signature,
    } as Record<string, string>,
  };
}

// ---- Callback handling -----------------------------------------------------
const SIGNABLE = ['transaction_code', 'status', 'total_amount', 'transaction_uuid', 'product_code', 'signed_field_names'] as const;
type SignableField = (typeof SIGNABLE)[number];

export interface EsewaCallback extends Record<SignableField, string> { signature: string }

/** Decodes the base64 `data` query param. Returns null for anything malformed. */
export function decodeEsewaCallback(encoded: string): EsewaCallback | null {
  try {
    const json: unknown = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    if (typeof json !== 'object' || json === null) return null;
    const src = json as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const key of [...SIGNABLE, 'signature']) {
      const v = src[key];
      if (v === undefined || v === null) return null;
      // NOTE: eSewa may send total_amount as a number (230) or a comma string ("1,000.0").
      // We sign over whatever it sent, as a string, which is what eSewa did too.
      out[key] = String(v);
    }
    return out as unknown as EsewaCallback;
  } catch {
    return null;
  }
}

/** Recomputes the signature over `signed_field_names` (in eSewa's order) and compares in constant time. */
export function verifyEsewaSignature(cb: EsewaCallback): boolean {
  const names = cb.signed_field_names.split(',');
  const mustSign = ['status', 'total_amount', 'transaction_uuid', 'product_code'];
  if (!mustSign.every((f) => names.includes(f))) return false;
  if (!names.every((n): n is SignableField => (SIGNABLE as readonly string[]).includes(n))) return false;

  const message = (names as SignableField[]).map((n) => `${n}=${cb[n]}`).join(',');
  const expected = Buffer.from(signMessage(message, getEsewaConfig().secretKey));
  const received = Buffer.from(cb.signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** Parses "1,000.0" / 230 / "230" into a number. */
export function parseEsewaAmount(raw: string): number {
  return Number(raw.replace(/,/g, ''));
}

/**
 * Server-to-server status check: the authoritative answer. Returns null if eSewa is
 * unreachable (caller should treat that as "pending", never as "paid").
 */
export async function lookupEsewaStatus(args: { orderId: string; totalNpr: number }) {
  const cfg = getEsewaConfig();
  const url = new URL(cfg.statusUrl);
  url.searchParams.set('product_code', cfg.productCode);
  url.searchParams.set('total_amount', formatAmount(args.totalNpr));
  url.searchParams.set('transaction_uuid', args.orderId);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const j = (await res.json()) as { status?: unknown; refId?: unknown; totalAmount?: unknown };
    if (typeof j.status !== 'string') return null;
    return {
      status: j.status,                                   // COMPLETE | PENDING | CANCELED | NOT_FOUND | ...
      refId: j.refId ? String(j.refId) : null,
      totalAmount: typeof j.totalAmount === 'number' ? j.totalAmount : null,
    };
  } catch {
    return null;
  }
}
