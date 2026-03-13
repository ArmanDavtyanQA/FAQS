"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { dbListFaqsByUserIdLight } from "@/lib/faq/supabase-faq";
import type { FAQ } from "@/lib/faq/types";
import FAQTable from "./FAQTable";

const actionBtn =
  "btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 min-w-[10rem] flex-1 items-center justify-center rounded-3xl bg-black/[0.03] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#111827] sm:flex-none sm:min-w-[11rem]";
const actionBtnPrimary =
  "btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 min-w-[10rem] flex-1 items-center justify-center rounded-3xl bg-black/[0.05] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#020617] sm:flex-none sm:min-w-[11rem]";

export default function DashboardFaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedForUserRef = useRef<string | null>(null);
  const loadInFlightRef = useRef<string | null>(null);

  const load = useCallback(async (uid: string) => {
    if (loadInFlightRef.current === uid) return;
    loadInFlightRef.current = uid;
    setError(null);
    try {
      const list = await dbListFaqsByUserIdLight(supabase, uid);
      setFaqs(list);
      loadedForUserRef.current = uid;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load FAQs");
      setFaqs([]);
    } finally {
      loadInFlightRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUserId(session.user.id);
      await load(session.user.id);
      if (!cancelled) setLoading(false);
    })();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      if (event === "TOKEN_REFRESHED") return;
      if (event === "INITIAL_SESSION" && session?.user) {
        if (loadedForUserRef.current === session.user.id) return;
        setUserId(session.user.id);
        await load(session.user.id);
        setLoading(false);
        return;
      }
      if (event === "SIGNED_OUT" || !session?.user) {
        loadedForUserRef.current = null;
        setUserId(null);
        setFaqs([]);
        return;
      }
      if (event === "SIGNED_IN" && session.user) {
        if (loadedForUserRef.current === session.user.id) return;
        setUserId(session.user.id);
        await load(session.user.id);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [load]);

  if (loading) {
    return (
      <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
        Loading…
      </p>
    );
  }
  if (!userId) {
    return (
      <p className="text-sm text-[#6b6b6b]">Sign in to manage FAQs.</p>
    );
  }

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/faq/${userId}`
      : `/faq/${userId}`;

  return (
    <>
      {error && (
        <p className="rounded-xl border border-[#c4c4c4] bg-[#fafaf9] px-4 py-3 text-sm text-[#0a0a0a] shadow-md">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={`/faq/${userId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={actionBtn}
        >
          View published FAQs
        </Link>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(publicUrl)}
          className={actionBtn}
        >
          Copy link
        </button>
        <Link href="/dashboard/faq/create" className={actionBtnPrimary}>
          Create FAQ
        </Link>
      </div>
      <div className="mt-8">
        <FAQTable faqs={faqs} />
      </div>
    </>
  );
}
