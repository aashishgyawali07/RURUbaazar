/**
 * TEMPORARY LOCAL-DEV AUTH BYPASS.
 * Lets you preview /buyer and /seller pages without Supabase configured.
 *
 * Safety: the bypass is hard-disabled when NODE_ENV === 'production', regardless of
 * the env var, and next.config.mjs fails the production build if the flag is set.
 * DELETE this file (and its 3 call sites) once Supabase is wired up.
 */
export function isAuthBypassed(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH === 'true';
}
