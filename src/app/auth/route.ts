import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirectTo") ?? "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${req.nextUrl.origin}/auth/callback?redirectTo=${encodeURIComponent(
        redirectTo,
      )}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent("Unable to start Google login")}`, req.url),
    );
  }

  return NextResponse.redirect(data.url);
}

