"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbListFaqsByUserIdLight } from "@/lib/faq/supabase-faq";
import { dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import type { FAQ, Topic } from "@/lib/faq/types";
import DashboardSpinner, {
  DashboardTableSkeleton,
} from "@/components/DashboardSpinner";
import FAQTable from "./FAQTable";
import FAQForm from "./FAQForm";

const actionBtn =
  "btn-ui btn-ui-secondary h-10 min-w-[10rem] flex-1 rounded-2xl px-4 text-ui-strong sm:flex-none sm:min-w-[11rem]";
const actionBtnPrimary =
  "btn-ui btn-ui-primary h-10 min-w-[10rem] flex-1 rounded-2xl px-4 sm:flex-none sm:min-w-[11rem]";

const actionDisabled =
  "pointer-events-none cursor-not-allowed opacity-45 hover:translate-y-0";

export default function DashboardFaqSection({
  projectId,
}: {
  projectId?: string;
}) {
  const router = useRouter();
  const paidPlan = process.env.NEXT_PUBLIC_FAQ_PLAN === "paid";
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createInitialTopicId, setCreateInitialTopicId] = useState<string | null>(null);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [topicsChannel] = useState(() =>
    Math.random().toString(36).slice(2, 10),
  );
  const loadedForUserRef = useRef<string | null>(null);
  const loadInFlightRef = useRef<string | null>(null);
  const topicsFrameRef = useRef<HTMLIFrameElement | null>(null);

  const load = useCallback(async (uid: string) => {
    if (loadInFlightRef.current === uid) return;
    loadInFlightRef.current = uid;
    setError(null);
    try {
      const [list, topicList] = await Promise.all([
        dbListFaqsByUserIdLight(supabase, uid, projectId),
        dbListTopicsByUserId(supabase, uid, projectId),
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
  }, [projectId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onTopicsMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== topicsFrameRef.current?.contentWindow) return;
      const payload = event.data as {
        type?: string;
        channel?: string;
        href?: string;
      } | null;
      if (!payload?.type) return;
      if (payload.channel !== topicsChannel) return;
      if (payload.type === "faq-topics:done") {
        setTopicsOpen(false);
        return;
      }
      if (payload.type === "faq-topics:updated") {
        setTopicsOpen(false);
        if (userId) void load(userId);
        return;
      }
      if (payload.type === "faq-topics:navigate" && payload.href) {
        setTopicsOpen(false);
        if (payload.href.startsWith("/dashboard/faq/create")) {
          try {
            const u = new URL(payload.href, window.location.origin);
            const topic = u.searchParams.get("topic");
            setCreateInitialTopicId(topic || null);
            setCreateOpen(true);
            return;
          } catch {
            // fall through to router push
          }
        }
        if (payload.href.startsWith("/")) {
          router.push(payload.href);
        }
      }
    }
    window.addEventListener("message", onTopicsMessage);
    return () => window.removeEventListener("message", onTopicsMessage);
  }, [load, router, topicsChannel, userId]);

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
      <p className="text-sm text-ui-muted">Sign in to manage FAQs.</p>
    );
  }

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/faq/${userId}${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`
      : `/faq/${userId}${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`;

  const actionsLocked = loading;
  const topicsUrl = projectId
    ? `/dashboard/faq/topics?projectId=${encodeURIComponent(projectId)}&modalChannel=${encodeURIComponent(topicsChannel)}`
    : `/dashboard/faq/topics?modalChannel=${encodeURIComponent(topicsChannel)}`;

  return (
    <>
      {error && (
        <p className="panel-base rounded-2xl px-4 py-3 text-sm leading-relaxed text-ui-strong shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          {error}
        </p>
      )}
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${actionsLocked ? actionDisabled : ""}`}
        aria-busy={actionsLocked}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/faq/${userId}${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`}
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
          <button
            type="button"
            disabled={actionsLocked}
            className={actionBtn}
            onClick={() => {
              if (actionsLocked) return;
              setCreateOpen(false);
              setTopicsOpen(true);
            }}
          >
            Manage topics
          </button>
          <button
            type="button"
            disabled={actionsLocked}
            className={actionBtnPrimary}
            onClick={() => {
              if (actionsLocked) return;
              setTopicsOpen(false);
              setCreateInitialTopicId(null);
              setCreateOpen(true);
            }}
          >
            Create FAQ
          </button>
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
          <FAQTable faqs={faqs} topics={topics} projectId={projectId} />
        )}
      </div>
      {mounted && topicsOpen
        && !createOpen
        ? createPortal(
            <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6 sm:px-6">
              <button
                type="button"
                aria-label="Close manage topics dialog"
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setTopicsOpen(false)}
              />
              <div className="relative z-[1] flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#e8e6e3] bg-[#fdfdfb] shadow-[0_30px_120px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-4 border-b border-[#e8e6e3] px-4 py-3 sm:px-5">
                  <h2 className="text-lg font-semibold tracking-tight text-ui-strong">
                    Manage topics
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTopicsOpen(false)}
                    className="btn-ui btn-ui-ghost h-9 rounded-xl px-3"
                  >
                    Close
                  </button>
                </div>
                <iframe
                  ref={topicsFrameRef}
                  src={topicsUrl}
                  className="h-full w-full bg-white"
                  title="Manage topics"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
      {mounted && createOpen
        && !topicsOpen
        ? createPortal(
            <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6 sm:px-6">
              <button
                type="button"
                aria-label="Close create FAQ dialog"
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setCreateOpen(false)}
              />
              <div className="relative z-[1] max-h-[92dvh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-[#e8e6e3] bg-[#fdfdfb] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.2)] sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold tracking-tight text-ui-strong">
                    Create FAQ
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="btn-ui btn-ui-ghost h-9 rounded-xl px-3"
                  >
                    Close
                  </button>
                </div>
                <FAQForm
                  paidPlan={paidPlan}
                  initialTopicId={createInitialTopicId}
                  projectId={projectId ?? null}
                  onCancel={() => setCreateOpen(false)}
                  onFinish={async () => {
                    setCreateOpen(false);
                    setCreateInitialTopicId(null);
                    if (userId) await load(userId);
                  }}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
