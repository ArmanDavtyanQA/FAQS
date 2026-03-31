"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { dbListFaqsByUserIdLight } from "@/lib/faq/supabase-faq";
import { dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import type { FAQ, Topic } from "@/lib/faq/types";
import DashboardSpinner, {
  DashboardTableSkeleton,
} from "@/components/DashboardSpinner";
import FAQTable from "./FAQTable";

const actionBtn =
  "interactive-smooth inline-flex h-10 min-w-[10rem] flex-1 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm shadow-black/[0.06] transition-all duration-300 hover:bg-surface-muted hover:border-[#d6d3d1] sm:flex-none sm:min-w-[11rem]";
const actionBtnPrimary =
  "interactive-smooth inline-flex h-10 min-w-[10rem] flex-1 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm shadow-black/[0.06] transition-all duration-300 hover:bg-surface-muted hover:border-[#d6d3d1] sm:flex-none sm:min-w-[11rem]";

const actionDisabled =
  "pointer-events-none cursor-not-allowed opacity-45 hover:translate-y-0";

export default function DashboardFaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
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
      const [list, topicList] = await Promise.all([
        dbListFaqsByUserIdLight(supabase, uid),
        dbListTopicsByUserId(supabase, uid),
      ]);
      setFaqs(list);
      setTopics(topicList);
      loadedForUserRef.current = uid;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load FAQs");
      setFaqs([]);
      setTopics([]);
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
        setTopics([]);
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

  if (loading && !userId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-8">
        <DashboardSpinner label="Loading your FAQs…" />
      </div>
    );
  }
  if (!userId) {
    return (
      <p className="text-sm text-[#4A4A4A]">Sign in to manage FAQs.</p>
    );
  }

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/faq/${userId}`
      : `/faq/${userId}`;

  const actionsLocked = loading;

  return (
    <>
      {error && (
        <p className="rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 px-4 py-3 text-sm leading-relaxed text-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          {error}
        </p>
      )}
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${actionsLocked ? actionDisabled : ""}`}
        aria-busy={actionsLocked}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/faq/${userId}`}
            prefetch={!actionsLocked}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={actionsLocked ? -1 : undefined}
            aria-disabled={actionsLocked}
            className={actionBtn}
            onClick={(e) => {
              if (actionsLocked) e.preventDefault();
            }}
          >
            View published FAQs
          </Link>
          <button
            type="button"
            disabled={actionsLocked}
            onClick={() => navigator.clipboard.writeText(publicUrl)}
            className={actionBtn}
          >
            Copy link
          </button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
          <Link
            href="/dashboard/faq/topics"
            prefetch={!actionsLocked}
            tabIndex={actionsLocked ? -1 : undefined}
            aria-disabled={actionsLocked}
            className={actionBtn}
            onClick={(e) => {
              if (actionsLocked) e.preventDefault();
            }}
          >
            Manage topics
          </Link>
          <Link
            href="/dashboard/faq/create"
            prefetch={!actionsLocked}
            tabIndex={actionsLocked ? -1 : undefined}
            aria-disabled={actionsLocked}
            className={actionBtnPrimary}
            onClick={(e) => {
              if (actionsLocked) e.preventDefault();
            }}
          >
            Create FAQ
          </Link>
        </div>
      </div>
      <div className="relative mt-8">
        {loading ? (
          <>
            <div className="mb-6 flex justify-center sm:justify-start">
              <DashboardSpinner label="Loading questions…" size="sm" />
            </div>
            <DashboardTableSkeleton rows={5} />
          </>
        ) : (
          <FAQTable faqs={faqs} topics={topics} />
        )}
      </div>
    </>
  );
}
