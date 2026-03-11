import { NextResponse } from "next/server";
import { createSupabaseServerAnon } from "@/lib/supabase/server";
import { dbListFaqsByUserId } from "@/lib/faq/supabase-faq";

/**
 * GET /api/faq?userId=... — list FAQs for user (requires RLS: only own rows if authenticated).
 * For unauthenticated use, prefer client-side Supabase with session.
 */
export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  try {
    const supabase = createSupabaseServerAnon();
    const faqs = await dbListFaqsByUserId(supabase, userId);
    return NextResponse.json({ faqs });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
