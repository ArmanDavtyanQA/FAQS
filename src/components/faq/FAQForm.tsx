"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbInsertFaq } from "@/lib/faq/supabase-faq";
import { dbInsertTopic, dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import { DEFAULT_FAQ_TEMPLATES } from "@/lib/faq/faq-ai";
import type { FAQGenerateItem, Topic } from "@/lib/faq/types";
import { Trash2 } from "lucide-react";
import FAQSuggestions from "./FAQSuggestions";
import RichTextEditor from "@/components/RichTextEditor";
import RichText from "@/components/RichText";

type Props = {
  paidPlan: boolean;
  /** When set (e.g. `?topic=` from manage topics), empty question blocks default to this topic. */
  initialTopicId?: string | null;
};

type QuestionBlock = {
  title: string;
  answers: string[];
  topicIds: string[];
};

function defaultTopicIds(topics: Topic[]): string[] {
  return topics.length === 1 ? [topics[0].id] : [];
}

export default function FAQForm({
  paidPlan,
  initialTopicId = null,
}: Props) {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [addingTopic, setAddingTopic] = useState(false);
  const [questions, setQuestions] = useState<QuestionBlock[]>([
    { title: "", answers: [""], topicIds: [] },
  ]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [merchantUrl, setMerchantUrl] = useState("");
  /** Live preview accordion: which question row is expanded (null = all collapsed). */
  const [previewOpenIndex, setPreviewOpenIndex] = useState<number | null>(null);
  /** Question indices missing topics after failed save (highlights “Topics for this question”). */
  const [topicFieldHighlight, setTopicFieldHighlight] = useState<number[]>([]);
  const topicSectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  /** First question block to fix when “Add at least one question with an answer” fails. */
  const [questionBlockHighlightIndex, setQuestionBlockHighlightIndex] =
    useState<number | null>(null);
  const questionBlockRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (topicFieldHighlight.length === 0) return;
    const first = Math.min(...topicFieldHighlight);
    const el = topicSectionRefs.current.get(first);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [topicFieldHighlight]);

  useEffect(() => {
    if (questionBlockHighlightIndex === null) return;
    const el = questionBlockRefs.current.get(questionBlockHighlightIndex);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [questionBlockHighlightIndex]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) {
          if (!cancelled) setTopicsLoading(false);
          return;
        }
        const list = await dbListTopicsByUserId(supabase, user.id);
        if (!cancelled) {
          setTopics(list);
          setQuestions((qs) =>
            qs.map((q) => {
              if (q.topicIds.length > 0) return q;
              if (
                initialTopicId &&
                list.some((t) => t.id === initialTopicId)
              ) {
                return { ...q, topicIds: [initialTopicId] };
              }
              if (list.length === 1) {
                return { ...q, topicIds: [list[0].id] };
              }
              return q;
            }),
          );
        }
      } catch {
        if (!cancelled) setError("Could not load topics.");
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialTopicId]);

  function hasMeaningfulText(html: string) {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 0;
  }

  /** Index of the first question missing a title or a non-empty answer (same rules as submit). */
  function firstIncompleteQuestionIndex(qs: QuestionBlock[]) {
    for (let i = 0; i < qs.length; i++) {
      const title = qs[i].title.trim();
      const answers = qs[i].answers.filter(hasMeaningfulText);
      if (!title || answers.length === 0) return i;
    }
    return 0;
  }

  async function handleAddTopic(e?: React.FormEvent) {
    e?.preventDefault();
    const title = newTopicTitle.trim();
    if (!title) return;
    setAddingTopic(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in.");
        return;
      }
      const row = await dbInsertTopic(supabase, {
        userId: user.id,
        title,
      });
      setTopics((prev) => {
        const wasEmpty = prev.length === 0;
        const next = [...prev, row].sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        if (wasEmpty) {
          setQuestions((qs) =>
            qs.map((q) => ({
              ...q,
              topicIds: q.topicIds.length === 0 ? [row.id] : q.topicIds,
            })),
          );
        }
        return next;
      });
      setNewTopicTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add topic");
    } finally {
      setAddingTopic(false);
    }
  }

  function addQuestion() {
    setQuestionBlockHighlightIndex(null);
    setQuestions((qs) => [
      ...qs,
      { title: "", answers: [""], topicIds: defaultTopicIds(topics) },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestionBlockHighlightIndex(null);
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function setTitleAt(index: number, value: string) {
    setQuestionBlockHighlightIndex((prev) =>
      prev === index ? null : prev,
    );
    setQuestions((qs) => {
      const next = [...qs];
      next[index] = { ...next[index], title: value };
      return next;
    });
  }

  function toggleQuestionTopic(questionIndex: number, topicId: string) {
    setTopicFieldHighlight((prev) => prev.filter((i) => i !== questionIndex));
    setQuestions((qs) => {
      const next = [...qs];
      const q = { ...next[questionIndex] };
      const set = new Set(q.topicIds);
      if (set.has(topicId)) set.delete(topicId);
      else set.add(topicId);
      q.topicIds = [...set];
      next[questionIndex] = q;
      return next;
    });
  }

  function addAnswer(questionIndex: number) {
    setQuestions((qs) => {
      const next = [...qs];
      next[questionIndex] = {
        ...next[questionIndex],
        answers: [...next[questionIndex].answers, ""],
      };
      return next;
    });
  }

  function setAnswerAt(
    questionIndex: number,
    answerIndex: number,
    value: string,
  ) {
    setQuestionBlockHighlightIndex((prev) =>
      prev === questionIndex ? null : prev,
    );
    setQuestions((qs) => {
      const next = [...qs];
      const answers = [...next[questionIndex].answers];
      answers[answerIndex] = value;
      next[questionIndex] = { ...next[questionIndex], answers };
      return next;
    });
  }

  function removeAnswer(questionIndex: number, answerIndex: number) {
    setQuestions((qs) => {
      const next = [...qs];
      next[questionIndex] = {
        ...next[questionIndex],
        answers: next[questionIndex].answers.filter(
          (_, i) => i !== answerIndex,
        ),
      };
      return next;
    });
  }

  function applySuggestion(item: FAQGenerateItem) {
    setQuestions((qs) => {
      const base: QuestionBlock = {
        title: item.question,
        answers: item.answers.length ? item.answers : [""],
        topicIds: defaultTopicIds(topics),
      };
      if (qs.length === 0) return [base];
      const [, ...rest] = qs;
      return [base, ...rest];
    });
    setError(null);
  }

  async function handleGenerateWithAi() {
    if (!paidPlan) return;
    setAiLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/faq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantUrl: merchantUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      const items = data.items as FAQGenerateItem[];
      if (items?.length) applySuggestion(items[0]);
    } catch {
      setError("Network error");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTopicFieldHighlight([]);
    setQuestionBlockHighlightIndex(null);
    setSubmitting(true);
    try {
      if (topics.length === 0) {
        setError("Create at least one topic before adding questions.");
        return;
      }

      const prepared = questions
        .map((q, questionIndex) => ({
          questionIndex,
          title: q.title.trim(),
          answers: q.answers.map((a) => a.trim()).filter(hasMeaningfulText),
          topicIds: q.topicIds.filter((id) =>
            topics.some((t) => t.id === id),
          ),
        }))
        .filter((q) => q.title && q.answers.length > 0);

      if (prepared.length === 0) {
        setQuestionBlockHighlightIndex(firstIncompleteQuestionIndex(questions));
        setError("Add at least one question with an answer.");
        return;
      }

      const missingTopicRows = prepared.filter((q) => q.topicIds.length === 0);
      if (missingTopicRows.length > 0) {
        setTopicFieldHighlight(missingTopicRows.map((r) => r.questionIndex));
        setError("Each question must have at least one topic selected.");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to create an FAQ.");
        return;
      }

      for (const row of prepared) {
        await dbInsertFaq(supabase, {
          userId: user.id,
          title: row.title,
          answers: row.answers,
          status,
          topicIds: row.topicIds,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create FAQ");
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-2 w-full rounded-xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm font-light tracking-widest text-[#0a0a0a] shadow-sm placeholder:text-[#5A4A40] focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15 transition-all duration-300";

  const newTopicInputClass =
    "h-12 w-full min-w-[12rem] max-w-md flex-1 rounded-xl border border-[#e8e6e3] bg-surface px-4 text-sm font-light tracking-widest text-[#0a0a0a] shadow-sm placeholder:text-[#5A4A40] transition-all duration-300 focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15 hover:border-[#d6d3d1]";

  const statusSelectClass =
    "interactive-smooth mt-2 h-12 w-full max-w-xs cursor-pointer appearance-none rounded-2xl border border-[#e8e6e3] bg-surface bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-4 py-2.5 pr-11 text-sm font-light tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:border-[#d6d3d1] focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15 disabled:opacity-50 [&>option]:bg-surface [&>option]:text-[#0a0a0a] [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%230a0a0a%27%20stroke-width%3D%272%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19%209l-7%207-7-7%27%2F%3E%3C%2Fsvg%3E')]";

  const btnSolid =
    "interactive-smooth inline-flex items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted disabled:opacity-50";

  const canEditQuestions = topics.length >= 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-8"
      >
        {/* Step 1 — Topics */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="label-caps text-[#0a0a0a]">
                Step 1 — Topics <span className="text-[#5A4A40]">*</span>
              </p>
              <p className="mt-1 text-xs text-[#5A4A40]">
                Create topics first. You can rename or delete them later from{" "}
                <Link
                  href="/dashboard/faq/topics"
                  className="underline hover:text-[#0a0a0a]"
                >
                  Manage topics
                </Link>
                .
              </p>
            </div>
          </div>

          {topicsLoading ? (
            <p className="text-sm text-[#5A4A40]">Loading topics…</p>
          ) : (
            <>
              {topics.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-full border border-[#e8e6e3] bg-surface-muted px-3 py-1 text-[11px] font-mono font-light uppercase tracking-widest text-[#0a0a0a]"
                    >
                      {t.title}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-end gap-2">
                <input
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="New topic name"
                  className={newTopicInputClass}
                  disabled={addingTopic}
                />
                <button
                  type="button"
                  disabled={addingTopic || !newTopicTitle.trim()}
                  onClick={() => void handleAddTopic()}
                  className={`${btnSolid} h-12 shrink-0 px-5`}
                >
                  {addingTopic ? "Adding…" : "Add topic"}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Step 2 — Questions */}
        <section
          className={`space-y-6 ${!canEditQuestions ? "opacity-60" : ""}`}
        >
          <div>
            <label className="label-caps block">
              Step 2 — Questions <span className="text-[#5A4A40]">*</span>
            </label>
            <p className="mt-1 text-xs text-[#5A4A40]">
              {!canEditQuestions
                ? "Add at least one topic above before you can assign questions."
                : "Each question becomes a separate FAQ item. Pick one or more topics per question (at least one required)."}
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((q, questionIndex) => {
              return (
                <div
                  key={questionIndex}
                  ref={(node) => {
                    if (node)
                      questionBlockRefs.current.set(questionIndex, node);
                    else questionBlockRefs.current.delete(questionIndex);
                  }}
                  className={`scroll-mt-24 rounded-2xl border bg-surface-muted p-4 shadow-sm transition-[background-color,box-shadow,border-color] ${
                    questionBlockHighlightIndex === questionIndex
                      ? "border-amber-300/90 bg-[#fffbeb] shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/70"
                      : "border-[#e8e6e3]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <label className="label-caps block">
                        Question{" "}
                        {questions.length > 1 ? `#${questionIndex + 1}` : ""}
                      </label>
                      <input
                        value={q.title}
                        onChange={(e) =>
                          setTitleAt(questionIndex, e.target.value)
                        }
                        className={`${field} ${
                          questionBlockHighlightIndex === questionIndex
                            ? "border-amber-400/80 ring-2 ring-amber-300/80 ring-offset-2 ring-offset-[#fffbeb]"
                            : ""
                        }`}
                        placeholder="e.g. What is your return policy?"
                        disabled={!canEditQuestions}
                        aria-invalid={
                          questionBlockHighlightIndex === questionIndex
                        }
                      />
                    </div>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="mt-7 shrink-0 rounded-xl border border-[#e8e6e3] bg-surface px-3 py-2 text-[11px] uppercase tracking-widest text-[#5A4A40] shadow-sm transition-colors hover:border-[#d6d3d1] hover:bg-surface-muted hover:text-[#0a0a0a]"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div
                    ref={(node) => {
                      if (node)
                        topicSectionRefs.current.set(questionIndex, node);
                      else topicSectionRefs.current.delete(questionIndex);
                    }}
                    className={`mt-4 scroll-mt-24 rounded-xl p-3 transition-[background-color,box-shadow] ${
                      topicFieldHighlight.includes(questionIndex)
                        ? "bg-[#fffbeb] shadow-sm shadow-amber-900/5 ring-1 ring-amber-300/70"
                        : ""
                    }`}
                  >
                    <p className="label-caps">
                      Topics for this question{" "}
                      <span className="text-[#5A4A40]">*</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {topics.length === 0 ? (
                        <span className="text-xs text-[#5A4A40]">
                          No topics yet.
                        </span>
                      ) : (
                        topics.map((t) => {
                          const checked = q.topicIds.includes(t.id);
                          return (
                            <label
                              key={t.id}
                              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-mono font-medium uppercase tracking-widest transition-colors ${
                                checked
                                  ? "border-[#0a0a0a] bg-[#f5f5f4] text-[#0a0a0a]"
                                  : "border-[#e8e6e3] text-[#5A4A40] hover:border-[#d6d3d1]"
                              } ${!canEditQuestions ? "pointer-events-none opacity-50" : ""}`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                disabled={!canEditQuestions}
                                onChange={() =>
                                  toggleQuestionTopic(questionIndex, t.id)
                                }
                              />
                              {t.title}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="label-caps block">
                      Answers <span className="text-[#5A4A40]">*</span>
                    </label>
                    <div className="mt-2 space-y-3">
                      {q.answers.map((a, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="flex items-start gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <RichTextEditor
                              value={a}
                              onChange={(html) =>
                                setAnswerAt(
                                  questionIndex,
                                  answerIndex,
                                  html,
                                )
                              }
                              placeholder="Answer text..."
                              disabled={submitting || !canEditQuestions}
                            />
                          </div>
                          {q.answers.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeAnswer(questionIndex, answerIndex)
                              }
                              className="interactive-smooth mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e8e6e3] bg-surface text-[#6b6b6b] shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                              aria-label={`Remove answer ${answerIndex + 1}`}
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
                      onClick={() => addAnswer(questionIndex)}
                      disabled={!canEditQuestions}
                      className={`${btnSolid} mt-4 h-8 px-3 text-[10px] disabled:opacity-40`}
                    >
                      + Add answer
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addQuestion}
                disabled={!canEditQuestions}
                className={`${btnSolid} h-9 px-3 disabled:opacity-40`}
              >
                + Add question
              </button>
            </div>
          </div>
        </section>

        <div>
          <label className="label-caps block" htmlFor="faq-create-status">
            Status
          </label>
          <select
            id="faq-create-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published")
            }
            className={statusSelectClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {paidPlan && (
          <div className="rounded-2xl border border-[#e8e6e3] bg-surface-muted p-4 shadow-sm">
            <p className="label-caps">Paid plan: Generate with AI</p>
            <input
              type="url"
              value={merchantUrl}
              onChange={(e) => setMerchantUrl(e.target.value)}
              placeholder="https://your-store.com (optional)"
              className={field}
            />
            <button
              type="button"
              disabled={aiLoading}
              onClick={handleGenerateWithAi}
              className={`${btnSolid} mt-3 h-9 px-4`}
            >
              {aiLoading ? "Generating…" : "Generate FAQs with AI"}
            </button>
            <p className="mt-2 text-[11px] text-[#5A4A40]">
              If URL is empty, default templates are used as suggestions.
            </p>
          </div>
        )}

        {!paidPlan && (
          <p className="rounded-2xl border border-[#e8e6e3] bg-surface-muted px-4 py-3 text-sm leading-relaxed text-[#5A4A40] shadow-sm">
            Free plan: enter question and answers manually. Upgrade to Paid for
            AI generation and template suggestions.
          </p>
        )}

        {error && (
          <p role="alert" className="text-sm text-[#0a0a0a]">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting || !canEditQuestions}
            className={`${btnSolid} h-10 px-6`}
          >
            {submitting ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${btnSolid} h-10 px-6`}
          >
            Cancel
          </button>
        </div>
      </form>

      <aside className="space-y-6 rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl antigravity-lift">
        <div>
          <p className="label-caps mb-3 text-[#5A4A40]">Live preview</p>
          <div className="space-y-3">
            {questions.some(
              (q) =>
                q.title.trim() ||
                q.answers.some((a) => hasMeaningfulText(a)),
            ) ? (
              questions.map((q, idx) => {
                const hasContent =
                  q.title.trim() ||
                  q.answers.some((a) => hasMeaningfulText(a));
                if (!hasContent) return null;
                const labels = topics
                  .filter((t) => q.topicIds.includes(t.id))
                  .map((t) => t.title);
                const isPreviewOpen = previewOpenIndex === idx;
                const previewAnswers = q.answers.filter((a) =>
                  hasMeaningfulText(a),
                );
                return (
                  <div
                    key={idx}
                    className={`overflow-hidden rounded-xl bg-surface/60 backdrop-blur-md transition-all duration-500 blur-[0.5px] hover:blur-none ${
                      isPreviewOpen
                        ? "border-2 border-[#0a0a0a] shadow-md shadow-black/15 ring-1 ring-[#0a0a0a]/10"
                        : "border border-[#e8e6e3] shadow-sm shadow-black/[0.06]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isPreviewOpen}
                      onClick={() =>
                        setPreviewOpenIndex((cur) =>
                          cur === idx ? null : idx,
                        )
                      }
                      className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
                        isPreviewOpen
                          ? "bg-surface"
                          : "hover:bg-surface-muted/90"
                      }`}
                    >
                      <span className="text-sm font-medium text-[#0a0a0a]">
                        {q.title.trim() || "Untitled question"}
                      </span>
                      <span className="shrink-0 text-lg font-light leading-none text-[#5A4A40] tabular-nums">
                        {isPreviewOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isPreviewOpen && (
                      <>
                        {labels.length > 0 && (
                          <div className="border-t border-[#e8e6e3] bg-transparent px-5 py-2">
                            <p className="text-[10px] uppercase tracking-widest text-[#5A4A40] font-mono">
                              {labels.join(" · ")}
                            </p>
                          </div>
                        )}
                        {previewAnswers.length > 0 && (
                          <div className="border-t border-[#e8e6e3] bg-transparent px-5 py-4">
                            <div>
                              {previewAnswers.map((answer, answerIdx) => (
                                <div key={answerIdx}>
                                  {answerIdx > 0 && (
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
                );
              })
            ) : (
              <div className="rounded-2xl border border-[#e8e6e3] bg-black/[0.02] px-5 py-5 text-sm text-[#5A4A40] shadow-sm">
                <p className="font-medium text-[#0a0a0a]">
                  Your questions will appear here as separate items.
                </p>
                <p className="mt-2 leading-relaxed">
                  Start with topics, then add questions and answers on the left.
                </p>
                <p className="mt-2 text-xs text-[#5A4A40]">
                  Each question card is shown separately on your public FAQ page.
                </p>
              </div>
            )}
          </div>
        </div>

        {paidPlan && (
          <div className="border-t border-[#e8e6e3] pt-5">
            <p className="label-caps mb-3 text-[#5A4A40]">Suggestions</p>
            <FAQSuggestions
              templates={DEFAULT_FAQ_TEMPLATES}
              onSelect={applySuggestion}
              disabled={submitting}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
