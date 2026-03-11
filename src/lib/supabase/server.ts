import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with anon key (no user session).
 * Use for public reads allowed by RLS (e.g. published FAQs).
 */
export function createSupabaseServerAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
