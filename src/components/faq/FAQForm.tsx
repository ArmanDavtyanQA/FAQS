"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbInsertFaq } from "@/lib/faq/supabase-faq";
import { DEFAULT_FAQ_TEMPLATES } from "@/lib/faq/faq-ai";
import type { FAQGenerateItem } from "@/lib/faq/types";
import FAQSuggestions from "./FAQSuggestions";
import RichTextEditor from "@/components/RichTextEditor";
import RichText from "@/components/RichText";

type Props = {
  paidPlan: boolean;
};

type QuestionBlock = {
  title: string;
  answers: string[];
};

export default function FAQForm({ paidPlan }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionBlock[]>([
    { title: "", answers: [""] },
  ]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [merchantUrl, setMerchantUrl] = useState("");

  function hasMeaningfulText(html: string) {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 0;
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, { title: "", answers: [""] }]);
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
    // Apply suggestion to first question block for convenience
    setQuestions((qs) => {
      const base: QuestionBlock = {
        title: item.question,
        answers: item.answers.length ? item.answers : [""],
      };
      if (qs.length === 0) return [base];
      const [first, ...rest] = qs;
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
      const prepared = questions
        .map((q) => ({
          title: q.title.trim(),
          answers: q.answers.map((a) => a.trim()).filter(hasMeaningfulText),
        }))
        .filter((q) => q.title && q.answers.length > 0);

      if (prepared.length === 0) {
        setError("Add at least one question with an answer.");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
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
    "mt-2 w-full rounded-xl border border-[#e8e6e3] bg-white px-4 py-3 text-sm text-[#0a0a0a] shadow-sm placeholder:text-[#6b6b6b] focus:border-[#0a0a0a] focus:shadow-md focus:outline-none";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5"
      >
        <div>
          <label className="label-caps block">
            Questions <span className="text-[#6b6b6b]">*</span>
          </label>
          <p className="mt-1 text-xs text-[#9ca3af]">
            Each question will become a separate item on your FAQ page.
          </p>
        </div>

        <div className="space-y-5">
          {questions.map((q, questionIndex) => {
            return (
              <div
                key={questionIndex}
                className="rounded-2xl border border-[#e8e6e3] bg-[#f9f9f7] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <label className="label-caps block">
                      Question {questions.length > 1 ? `#${questionIndex + 1}` : ""}
                    </label>
                    <input
                      value={q.title}
                      onChange={(e) => setTitleAt(questionIndex, e.target.value)}
                      className={field}
                      placeholder="e.g. What is your return policy?"
                    />
                  </div>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="btn-ghost-edge mt-7 shrink-0 rounded-lg border border-transparent bg-white px-3 py-2 text-[11px] uppercase tracking-widest text-[#6b6b6b] shadow-sm hover:text-[#0a0a0a] hover:shadow-md"
                    >
                      Remove
                    </button>
                  )}
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
                              setAnswerAt(questionIndex, answerIndex, html)
                            }
                            placeholder="Answer text..."
                            disabled={submitting}
                          />
                        </div>
                        {q.answers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAnswer(questionIndex, answerIndex)}
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
            );
          })}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addQuestion}
              className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-9 items-center rounded-lg bg-black/[0.03] px-3 text-[11px] font-medium uppercase tracking-widest text-[#020617]"
            >
              + Add question
            </button>
          </div>
        </div>

        <div>
          <label className="label-caps block">
            Status
          </label>
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
          <div className="rounded-xl border border-[#e8e6e3] bg-[#f7f6f3] p-4 shadow-md shadow-black/5">
            <p className="label-caps">
              Paid plan: Generate with AI
            </p>
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
              className="btn-shadow-smooth btn-ghost-edge interactive-smooth mt-3 inline-flex h-9 items-center rounded-lg bg-black/[0.05] px-4 text-[11px] font-medium uppercase tracking-widest text-[#020617] disabled:opacity-50"
            >
              {aiLoading ? "Generating…" : "Generate FAQs with AI"}
            </button>
            <p className="mt-2 text-[11px] text-[#6b6b6b]">
              If URL is empty, default templates are used as suggestions.
            </p>
          </div>
        )}

        {!paidPlan && (
          <p className="rounded-xl border border-[#e8e6e3] bg-[#f7f6f3] px-4 py-3 text-sm text-[#6b6b6b] shadow-sm">
            Free plan: enter question and answers manually. Upgrade to Paid for
            AI generation and template suggestions.
          </p>
        )}

        {error && (
          <p className="text-sm text-[#0a0a0a]">{error}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617] disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]"
          >
            Cancel
          </button>
        </div>
      </form>

      <aside className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-lg shadow-black/5">
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
                  q.title.trim() || q.answers.some((a) => hasMeaningfulText(a));
                if (!hasContent) return null;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02] shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <span className="text-sm font-medium text-[#0a0a0a]">
                        {q.title.trim() || "Untitled question"}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
                        +
                      </span>
                    </div>
                    {q.answers.some((a) => hasMeaningfulText(a)) && (
                      <div className="border-t border-black/5 bg-[#f9f9f7] px-5 py-4">
                        <div className="space-y-3 text-sm leading-relaxed text-[#4b5563]">
                          {q.answers
                            .filter((a) => hasMeaningfulText(a))
                            .map((answer, answerIdx) => (
                              <RichText
                                key={answerIdx}
                                html={answer}
                                className="text-sm leading-relaxed text-[#4b5563]"
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-black/5 bg-black/[0.02] px-5 py-5 text-sm text-[#4b5563] shadow-sm backdrop-blur-sm">
                <p className="font-medium text-[#0a0a0a]">
                  Your questions will appear here as separate items.
                </p>
                <p className="mt-2">
                  Start by adding a question and at least one answer on the left.
                </p>
                <p className="mt-2 text-xs text-[#9ca3af]">
                  Each question card is shown separately for better UX on your public FAQ page.
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
