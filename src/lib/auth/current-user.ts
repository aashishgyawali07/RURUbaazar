import 'server-only';
import { isAuthBypassed } from '@/lib/dev-bypass';
import { createServerSupabase } from '@/lib/supabase/server';

/** Resolves the logged-in buyer on the server (API routes, Server Components). null = not logged in. */
export async function getCurrentBuyer(): Promise<{ id: string } | null> {
  if (isAuthBypassed()) return { id: 'dev-buyer' }; // DEV ONLY: remove with the bypass
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user ? { id: user.id } : null;
  } catch {
    return null; // e.g. Supabase env vars missing
  }
}
