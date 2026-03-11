"use server";

/**
 * FAQ CRUD is done via Supabase client in the browser (session + RLS).
 * This file is kept for any future server-only operations.
 */

export async function actionListPublishedFaqsForUser(userId: string) {
  const { createSupabaseServerAnon } = await import("@/lib/supabase/server");
  const { dbListPublishedByUserId } = await import("@/lib/faq/supabase-faq");
  const supabase = createSupabaseServerAnon();
  return dbListPublishedByUserId(supabase, userId);
}
