"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { dbUpdateFaq } from "@/lib/faq/supabase-faq";
import { dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import type { FAQ, Topic } from "@/lib/faq/types";
import RichTextEditor from "@/components/RichTextEditor";
import RichText from "@/components/RichText";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e8e6e3] bg-white px-4 py-3 text-sm text-[#0a0a0a] shadow-sm placeholder:text-[#6b6b6b] focus:border-[#0a0a0a] focus:shadow-md focus:outline-none";

export default function FAQDetailForm({ faq: initial }: { faq: FAQ }) {
  const router = useRouter();
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id || cancelled) return;
        const list = await dbListTopicsByUserId(supabase, user.id);
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
  }, []);

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
    const validTopicIds = topicIds.filter((id) =>
      topics.some((t) => t.id === id),
    );
    if (validTopicIds.length === 0) {
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
        className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-caps text-[#6b6b6b]">Topics</p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              At least one required.{" "}
              <Link
                href="/dashboard/faq/topics"
                className="underline hover:text-[#0a0a0a]"
              >
                Manage topics
              </Link>
            </p>
            {topicsLoading ? (
              <p className="mt-2 text-sm text-[#6b6b6b]">Loading topics…</p>
            ) : topics.length === 0 ? (
              <p className="mt-2 text-sm text-[#6b6b6b]">
                No topics yet.{" "}
                <Link
                  href="/dashboard/faq/create"
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
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                        checked
                          ? "border-[#0a0a0a] bg-[#f9f9f7] text-[#0a0a0a]"
                          : "border-[#e8e6e3] text-[#6b6b6b]"
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
                  ? "text-[10px] font-medium uppercase tracking-widest text-[#0a0a0a]"
                  : "text-[10px] font-medium uppercase tracking-widest text-[#6b6b6b]"
              }
            >
              {status}
            </span>
            <button
              type="button"
              disabled={saving}
              onClick={togglePublish}
              className="btn-shadow-smooth btn-ghost-edge interactive-smooth rounded-lg bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] disabled:opacity-50"
            >
              {status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e6e3] bg-[#f9f9f7] p-4 shadow-sm">
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
              <div className="flex items-center justify-between">
                <label className="label-caps">
                  Answers <span className="text-[#6b6b6b]">*</span>
                </label>
                <button
                  type="button"
                  onClick={addAnswer}
                  className="text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] underline"
                >
                  + Add answer
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {answers.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1">
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
                        className="btn-ghost-edge shrink-0 rounded-lg border border-transparent bg-white px-3 py-2 text-[11px] uppercase tracking-widest text-[#6b6b6b] shadow-sm hover:text-[#0a0a0a] hover:shadow-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
            onClick={() => router.push("/dashboard")}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]"
          >
            Back to list
          </button>
        </div>
      </form>

      <aside className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-lg shadow-black/5">
        <div>
          <p className="label-caps mb-3 text-[#6b6b6b]">Live preview</p>
          {hasPreviewContent ? (
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02] shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm font-medium text-[#0a0a0a]">
                  {title.trim() || "Untitled question"}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
                  +
                </span>
              </div>
              {topicLabels.length > 0 && (
                <div className="border-t border-black/5 px-5 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">
                    {topicLabels.map((t) => t.title).join(" · ")}
                  </p>
                </div>
              )}
              {answers.some((a) => hasMeaningfulText(a)) && (
                <div className="border-t border-black/5 bg-[#f9f9f7] px-5 py-4">
                  <div className="space-y-3 text-sm leading-relaxed text-[#4b5563]">
                    {answers
                      .filter((a) => hasMeaningfulText(a))
                      .map((answer, i) => (
                        <RichText
                          key={i}
                          html={answer}
                          className="text-sm leading-relaxed text-[#4b5563]"
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-5 py-5 text-sm text-[#4b5563] shadow-sm backdrop-blur-sm">
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
