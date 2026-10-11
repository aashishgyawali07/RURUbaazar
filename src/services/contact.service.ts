/**
 * CONTACT SERVICE (mock).
 * PRODUCTION: POST to a Route Handler (app/api/contact/route.ts) that validates again server-side,
 * rate-limits by IP, then either inserts into a Supabase `contact_messages` table or emails
 * support via a provider such as Resend. Never trust the client-side validation alone.
 */
import type { ContactValues } from '@/lib/validation/contact';
import type { ServiceResult } from '@/types';

export async function sendContactMessage(values: ContactValues): Promise<ServiceResult> {
  await new Promise((r) => setTimeout(r, 800)); // simulate latency
  console.info('[mock] contact message', { ...values, message: `${values.message.slice(0, 40)}…` });
  return { ok: true, data: undefined };
}
