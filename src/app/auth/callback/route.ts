import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

/** OAuth / email-confirmation landing point: swaps the `code` for a session cookie. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/buyer';
  // Only allow same-site relative redirects (prevents open-redirect abuse).
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/buyer';

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  return NextResponse.redirect(`${origin}/auth?error=callback`);
}
