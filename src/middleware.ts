import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthBypassed } from '@/lib/dev-bypass';

/**
 * Runs before every matched request. Two jobs:
 *  1. Refresh the Supabase session cookie.
 *  2. Gate /buyer and /seller behind login.
 * Role checks (buyer vs seller) are enforced again in each portal layout and,
 * critically, by Supabase Row Level Security: middleware is UX, RLS is security.
 */
export async function middleware(request: NextRequest) {
  // DEV ONLY: skip everything (and avoid creating a Supabase client with missing env vars).
  if (isAuthBypassed()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getUser() validates the token with Supabase (getSession() alone can be spoofed).
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ['/buyer/:path*', '/seller/:path*'] };
