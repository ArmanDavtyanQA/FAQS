"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const redirectTo =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirectTo") ?? "/"
        : "/";

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function safeReplace() {
      if (cancelled) return;
      setStatus("done");
      router.replace(redirectTo);
    }

    function safeSetError() {
      if (cancelled) return;
      setStatus("error");
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) {
        safeReplace();
        return;
      }
      // Hash may still be processed by Supabase client shortly after load
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (cancelled) return;
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          if (cancelled) return;
          if (s) safeReplace();
          else safeSetError();
        });
      }, 500);
    });

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [router]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent text-ui-strong">
        <div className="panel-base rounded-2xl bg-surface px-10 py-12 text-center shadow-2xl shadow-black/10">
          <p className="text-sm text-ui-muted">
            Sign-in could not be completed.
          </p>
          <a href="/" className="label-caps mt-4 inline-block text-ui-strong underline">
            Return home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent text-ui-strong">
      <div className="panel-base rounded-2xl bg-surface px-10 py-8 shadow-xl shadow-black/5">
        <p className="text-sm text-ui-muted">Signing you in…</p>
      </div>
    </div>
  );
}
