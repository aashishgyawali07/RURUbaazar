/**
 * AUTH SERVICE: the ONLY place that talks to Supabase Auth.
 * UI never imports Supabase directly. To switch to Firebase, rewrite this file
 * and keep the function signatures: nothing else changes.
 */
import { createClient } from '@/lib/supabase/client';
import type { OAuthProvider, ServiceResult, UserRole } from '@/types';

export async function signInWithEmail(email: string, password: string): Promise<ServiceResult> {
  const { error } = await createClient().auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: friendlyAuthError(error.message) } : { ok: true, data: undefined };
}

export async function signUpWithEmail(
  email: string, password: string, role: UserRole = 'buyer',
): Promise<ServiceResult<{ needsEmailConfirmation: boolean }>> {
  const { data, error } = await createClient().auth.signUp({
    email,
    password,
    options: {
      data: { role }, // stored in user metadata; mirror into a `profiles` table via a DB trigger
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  // No session means the project requires email confirmation.
  return { ok: true, data: { needsEmailConfirmation: !data.session } };
}

/** Redirects the browser to the provider; on return, /auth/callback finishes the exchange. */
export async function signInWithProvider(provider: OAuthProvider, next = '/buyer'): Promise<ServiceResult> {
  const { error } = await createClient().auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  return error ? { ok: false, error: friendlyAuthError(error.message) } : { ok: true, data: undefined };
}

/** Map raw provider errors to user-readable copy; never leak internals. */
function friendlyAuthError(raw: string): string {
  if (/invalid login credentials/i.test(raw)) return 'Email or password is incorrect.';
  if (/already registered/i.test(raw)) return 'An account with this email already exists. Log in instead.';
  if (/password/i.test(raw)) return 'Password does not meet the requirements.';
  return 'Something went wrong. Please try again.';
}
