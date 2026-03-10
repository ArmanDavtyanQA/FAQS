"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const redirectTo = searchParams.get("redirectTo") ?? "/";

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("done");
        router.replace(redirectTo);
        return;
      }
      // Hash may be present; Supabase client will pick it up on next getSession after a tick.
      const timer = setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          if (s) {
            setStatus("done");
            router.replace(redirectTo);
          } else {
            setStatus("error");
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    });
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="text-center">
          <p className="text-sm text-slate-300">Sign-in could not be completed.</p>
          <a href="/" className="mt-4 inline-block text-sm text-sky-400 hover:underline">
            Return home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <p className="text-sm text-slate-400">Signing you in…</p>
    </div>
  );
}
