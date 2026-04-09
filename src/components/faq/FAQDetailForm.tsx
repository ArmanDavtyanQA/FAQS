"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { dbUpdateFaq } from "@/lib/faq/supabase-faq";
import { dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import type { FAQ, Topic } from "@/lib/faq/types";
import { Trash2 } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import RichText from "@/components/RichText";

const inputClass =
  "mt-2 w-full rounded-xl border border-black/[0.08] bg-white/75 px-4 py-3 text-sm text-ui-strong shadow-sm placeholder:text-ui-muted focus:border-[#0a0a0a] focus:shadow-md focus:outline-none";

export default function FAQDetailForm({ faq: initial }: { faq: FAQ }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId")?.trim() || null;
  const [title, setTitle] = useState(initial.title);
  const [answers, setAnswers] = useState<string[]>(
    initial.answers.length ? initial.answers : [""],
  );
  const [status, setStatus] = useState<"draft" | "published">(initial.status);
  const [topicIds, setTopicIds] = useState<string[]>(initial.topicIds ?? []);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [topicSectionHighlight, setTopicSectionHighlight] = useState(false);
  const topicsHighlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topicSectionHighlight) return;
    const el = topicsHighlightRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [topicSectionHighlight]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id || cancelled) return;
        const list = await dbListTopicsByUserId(
          supabase,
          user.id,
          projectId ?? undefined,
        );
        if (!cancelled) setTopics(list);
      } catch {
        if (!cancelled) setError("Could not load topics.");
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    setTopicIds(initial.topicIds ?? []);
  }, [initial.id]);

  function addAnswer() {
    setAnswers((a) => [...a, ""]);
  }
  function setAnswerAt(index: number, value: string) {
    setAnswers((a) => {
      const next = [...a];
      next[index] = value;
      return next;
    });
  }
  function removeAnswer(index: number) {
    setAnswers((a) => a.filter((_, i) => i !== index));
  }

  function toggleTopic(id: string) {
    setTopicSectionHighlight(false);
    setTopicIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return [...s];
    });
  }

  function hasMeaningfulText(html: string) {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTopicSectionHighlight(false);
    const validTopicIds = topicIds.filter((id) =>
      topics.some((t) => t.id === id),
    );
    if (validTopicIds.length === 0) {
      setTopicSectionHighlight(true);
      setError("Select at least one topic for this question.");
      return;
    }
    setSaving(true);
    try {
      const trimmed = answers.map((a) => a.trim()).filter(hasMeaningfulText);
      const updated = await dbUpdateFaq(supabase, initial.id, {
        title: title.trim(),
        answers: trimmed,
        status,
        topicIds: validTopicIds,
      });
      setTitle(updated.title);
      setAnswers(updated.answers.length ? updated.answers : [""]);
      setStatus(updated.status);
      setTopicIds(updated.topicIds ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    const next = status === "published" ? "draft" : "published";
    setStatus(next);
    setSaving(true);
    setError(null);
    try {
      await dbUpdateFaq(supabase, initial.id, { status: next });
    } catch (err) {
      setStatus(status);
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const hasPreviewContent =
    title.trim() || answers.some((a) => hasMeaningfulText(a));

  const topicLabels = topics.filter((t) => topicIds.includes(t.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl antigravity-lift sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div
            ref={topicsHighlightRef}
            className={`min-w-0 max-w-full flex-1 scroll-mt-24 rounded-xl p-3 transition-[background-color,box-shadow] ${
              topicSectionHighlight
                ? "bg-[#fffbeb] shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/70"
                : ""
            }`}
          >
            <p className="label-caps text-[#5A4A40]">Topics</p>
            <p className="mt-1 text-xs text-[#5A4A40]">
              At least one required.{" "}
              <Link
                href={
                  projectId
                    ? `/dashboard/faq/topics?projectId=${encodeURIComponent(projectId)}`
                    : "/dashboard/faq/topics"
                }
                className="underline hover:text-[#0a0a0a]"
              >
                Manage topics
              </Link>
            </p>
            {topicsLoading ? (
              <p className="mt-2 text-sm text-[#5A4A40]">Loading topics…</p>
            ) : topics.length === 0 ? (
              <p className="mt-2 text-sm text-[#5A4A40]">
                No topics yet.{" "}
                <Link
                  href={
                    projectId
                      ? `/dashboard/faq/create?projectId=${encodeURIComponent(projectId)}`
                      : "/dashboard/faq/create"
                  }
                  className="underline hover:text-[#0a0a0a]"
                >
                  Create topics
                </Link>{" "}
                first.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {topics.map((t) => {
                  const checked = topicIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-mono font-medium uppercase tracking-widest transition-colors ${
                        checked
                          ? "border-[#0a0a0a] bg-[#f9f9f7] text-[#0a0a0a]"
                          : "border-[#e8e6e3] text-[#5A4A40]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleTopic(t.id)}
                      />
                      {t.title}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                status === "published"
                  ? "font-mono text-[10px] font-medium uppercase tracking-widest text-[#0a0a0a]"
                  : "font-mono text-[10px] font-medium uppercase tracking-widest text-[#5A4A40]"
              }
            >
              {status}
            </span>
            <button
              type="button"
              disabled={saving}
              onClick={togglePublish}
              className="btn-shadow-smooth btn-ghost-edge interactive-smooth rounded-lg bg-surface px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] disabled:opacity-50"
            >
              {status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e6e3] bg-black/[0.02] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="label-caps block">Question</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. What is your return policy?"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label-caps block">
                Answers <span className="text-[#5A4A40]">*</span>
              </label>
              <div className="mt-2 space-y-3">
                {answers.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <RichTextEditor
                        value={a}
                        onChange={(html) => setAnswerAt(i, html)}
                        placeholder="Answer text..."
                        disabled={saving}
                      />
                    </div>
                    {answers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(i)}
                        className="interactive-smooth mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e8e6e3] bg-surface text-[#5A4A40] shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        aria-label={`Remove answer ${i + 1}`}
                        title="Remove this answer"
                      >
                        <Trash2
                          className="size-3.5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addAnswer}
                disabled={saving}
                className="interactive-smooth mt-4 inline-flex h-8 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-3 text-[10px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted disabled:opacity-50"
              >
                + Add answer
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || topicsLoading || topics.length === 0}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() =>
              router.push(
                projectId ? `/project/${projectId}/dashboard` : "/studio",
              )
            }
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-surface px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]"
          >
            Back to list
          </button>
        </div>
      </form>

      <aside className="space-y-6 rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl antigravity-lift">
        <div>
          <p className="label-caps mb-3 text-[#5A4A40]">Live preview</p>
          {hasPreviewContent ? (
            <div
              className={`overflow-hidden rounded-xl bg-surface/60 backdrop-blur-md transition-all duration-500 blur-[0.5px] hover:blur-none ${
                previewOpen
                  ? "border-2 border-[#0a0a0a] shadow-md shadow-black/15 ring-1 ring-[#0a0a0a]/10"
                  : "border border-[#e8e6e3] shadow-sm shadow-black/[0.06]"
              }`}
            >
              <button
                type="button"
                aria-expanded={previewOpen}
                onClick={() => setPreviewOpen((o) => !o)}
                className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
                  previewOpen ? "bg-surface" : "hover:bg-surface-muted/90"
                }`}
              >
                <span className="text-sm font-medium text-[#0a0a0a]">
                  {title.trim() || "Untitled question"}
                </span>
                <span className="shrink-0 text-lg font-light leading-none text-[#5A4A40] tabular-nums">
                  {previewOpen ? "−" : "+"}
                </span>
              </button>
              {previewOpen && (
                <>
                  {topicLabels.length > 0 && (
                    <div className="border-t border-[#e8e6e3] bg-transparent px-5 py-2">
                      <p className="text-[10px] uppercase tracking-widest text-[#5A4A40] font-mono">
                        {topicLabels.map((t) => t.title).join(" · ")}
                      </p>
                    </div>
                  )}
                  {answers.some((a) => hasMeaningfulText(a)) && (
                    <div className="border-t border-[#e8e6e3] bg-transparent px-5 py-4 sm:px-6 sm:py-5">
                      <div>
                        {answers
                          .filter((a) => hasMeaningfulText(a))
                          .map((answer, i) => (
                            <div key={i}>
                              {i > 0 && (
                                <div
                                  className="my-5 h-px w-full bg-[#e8e6e3]"
                                  role="separator"
                                  aria-hidden
                                />
                              )}
                              <RichText
                                html={answer}
                                className="text-sm leading-relaxed text-[#5A4A40]"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e8e6e3] bg-black/[0.02] px-5 py-5 text-sm text-[#5A4A40] shadow-sm shadow-black/[0.06]">
              <p className="font-medium text-[#0a0a0a]">
                Your question will appear here as it looks on the public FAQ
                page.
              </p>
              <p className="mt-2">
                Edit the question, topics, and answers on the left to see them
                update in real time.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
