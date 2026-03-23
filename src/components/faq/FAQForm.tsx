"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbInsertFaq } from "@/lib/faq/supabase-faq";
import { dbInsertTopic, dbListTopicsByUserId } from "@/lib/faq/supabase-topics";
import { DEFAULT_FAQ_TEMPLATES } from "@/lib/faq/faq-ai";
import type { FAQGenerateItem, Topic } from "@/lib/faq/types";
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
    setQuestions((qs) => [
      ...qs,
      { title: "", answers: [""], topicIds: defaultTopicIds(topics) },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function setTitleAt(index: number, value: string) {
    setQuestions((qs) => {
      const next = [...qs];
      next[index] = { ...next[index], title: value };
      return next;
    });
  }

  function toggleQuestionTopic(questionIndex: number, topicId: string) {
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
    setSubmitting(true);
    try {
      if (topics.length === 0) {
        setError("Create at least one topic before adding questions.");
        return;
      }

      const prepared = questions
        .map((q) => ({
          title: q.title.trim(),
          answers: q.answers.map((a) => a.trim()).filter(hasMeaningfulText),
          topicIds: q.topicIds.filter((id) =>
            topics.some((t) => t.id === id),
          ),
        }))
        .filter((q) => q.title && q.answers.length > 0);

      if (prepared.length === 0) {
        setError("Add at least one question with an answer.");
        return;
      }

      const missingTopics = prepared.find((q) => q.topicIds.length === 0);
      if (missingTopics) {
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

      for (const q of prepared) {
        await dbInsertFaq(supabase, {
          userId: user.id,
          title: q.title,
          answers: q.answers,
          status,
          topicIds: q.topicIds,
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
    "mt-2 w-full rounded-xl border border-[#e8e6e3] bg-white px-4 py-3 text-sm font-light tracking-widest text-[#0a0a0a] shadow-sm placeholder:text-[#6b6b6b] focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15 transition-all duration-300";

  const btnSolid =
    "interactive-smooth inline-flex items-center justify-center rounded-xl border border-[#e8e6e3] bg-white text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-[#fafaf9] disabled:opacity-50";

  const canEditQuestions = topics.length >= 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
      >
        {/* Step 1 — Topics */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="label-caps text-[#0a0a0a]">
                Step 1 — Topics <span className="text-[#6b6b6b]">*</span>
              </p>
              <p className="mt-1 text-xs text-[#9ca3af]">
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
            <p className="text-sm text-[#6b6b6b]">Loading topics…</p>
          ) : (
            <>
              {topics.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-full border border-[#e8e6e3] bg-[#fafaf9] px-3 py-1 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a]"
                    >
                      {t.title}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                <input
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="New topic name"
                  className={`${field} mt-0 max-w-md flex-1 min-w-[10rem]`}
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
              Step 2 — Questions <span className="text-[#6b6b6b]">*</span>
            </label>
            <p className="mt-1 text-xs text-[#9ca3af]">
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
                  className="rounded-2xl border border-[#e8e6e3] bg-[#fafaf9] p-4 shadow-sm"
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
                        className={field}
                        placeholder="e.g. What is your return policy?"
                        disabled={!canEditQuestions}
                      />
                    </div>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="mt-7 shrink-0 rounded-xl border border-[#e8e6e3] bg-white px-3 py-2 text-[11px] uppercase tracking-widest text-[#6b6b6b] shadow-sm transition-colors hover:border-[#d6d3d1] hover:bg-[#fafaf9] hover:text-[#0a0a0a]"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="label-caps">
                      Topics for this question{" "}
                      <span className="text-[#6b6b6b]">*</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {topics.length === 0 ? (
                        <span className="text-xs text-[#9ca3af]">
                          No topics yet.
                        </span>
                      ) : (
                        topics.map((t) => {
                          const checked = q.topicIds.includes(t.id);
                          return (
                            <label
                              key={t.id}
                              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                                checked
                                  ? "border-[#0a0a0a] bg-[#f5f5f4] text-[#0a0a0a]"
                                  : "border-[#e8e6e3] text-[#6b6b6b] hover:border-[#d6d3d1]"
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
                    <div className="flex items-center justify-between">
                      <label className="label-caps">
                        Answers <span className="text-[#6b6b6b]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => addAnswer(questionIndex)}
                        className="text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] underline"
                        disabled={!canEditQuestions}
                      >
                        + Add answer
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {q.answers.map((a, answerIndex) => (
                        <div key={answerIndex} className="flex gap-2">
                          <div className="flex-1">
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
                              className="shrink-0 rounded-xl border border-[#e8e6e3] bg-white px-3 py-2 text-[11px] uppercase tracking-widest text-[#6b6b6b] shadow-sm transition-colors hover:border-[#d6d3d1] hover:bg-[#fafaf9] hover:text-[#0a0a0a]"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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
          <label className="label-caps block">Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published")
            }
            className={field}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {paidPlan && (
          <div className="rounded-2xl border border-[#e8e6e3] bg-[#fafaf9] p-4 shadow-sm">
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
            <p className="mt-2 text-[11px] text-[#6b6b6b]">
              If URL is empty, default templates are used as suggestions.
            </p>
          </div>
        )}

        {!paidPlan && (
          <p className="rounded-2xl border border-[#e8e6e3] bg-[#fafaf9] px-4 py-3 text-sm leading-relaxed text-[#6b6b6b] shadow-sm">
            Free plan: enter question and answers manually. Upgrade to Paid for
            AI generation and template suggestions.
          </p>
        )}

        {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}

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

      <aside className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5">
        <div>
          <p className="label-caps mb-3 text-[#6b6b6b]">Live preview</p>
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
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-[#e8e6e3] bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm font-medium text-[#0a0a0a]">
                        {q.title.trim() || "Untitled question"}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
                        +
                      </span>
                    </div>
                    {labels.length > 0 && (
                      <div className="border-t border-[#e8e6e3] px-5 py-2">
                        <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">
                          {labels.join(" · ")}
                        </p>
                      </div>
                    )}
                    {q.answers.some((a) => hasMeaningfulText(a)) && (
                      <div className="border-t border-[#e8e6e3] bg-[#fafaf9] px-5 py-4 shadow-inner">
                        <div className="space-y-3 text-sm leading-relaxed text-[#6b6b6b]">
                          {q.answers
                            .filter((a) => hasMeaningfulText(a))
                            .map((answer, answerIdx) => (
                              <RichText
                                key={answerIdx}
                                html={answer}
                                className="text-sm leading-relaxed text-[#6b6b6b]"
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[#e8e6e3] bg-white px-5 py-5 text-sm text-[#6b6b6b] shadow-sm">
                <p className="font-medium text-[#0a0a0a]">
                  Your questions will appear here as separate items.
                </p>
                <p className="mt-2 leading-relaxed">
                  Start with topics, then add questions and answers on the left.
                </p>
                <p className="mt-2 text-xs text-[#9ca3af]">
                  Each question card is shown separately on your public FAQ page.
                </p>
              </div>
            )}
          </div>
        </div>

        {paidPlan && (
          <div className="border-t border-[#e8e6e3] pt-5">
            <p className="label-caps mb-3 text-[#6b6b6b]">Suggestions</p>
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
