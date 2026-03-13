"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbInsertFaq } from "@/lib/faq/supabase-faq";
import { DEFAULT_FAQ_TEMPLATES } from "@/lib/faq/faq-ai";
import type { FAQGenerateItem } from "@/lib/faq/types";
import FAQSuggestions from "./FAQSuggestions";

type Props = {
  paidPlan: boolean;
};

export default function FAQForm({ paidPlan }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [merchantUrl, setMerchantUrl] = useState("");

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

  function applySuggestion(item: FAQGenerateItem) {
    setTitle(item.question);
    setAnswers(item.answers.length ? item.answers : [""]);
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
      const trimmedAnswers = answers.map((a) => a.trim()).filter(Boolean);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to create an FAQ.");
        return;
      }
      await dbInsertFaq(supabase, {
        userId: user.id,
        title: title.trim(),
        answers: trimmedAnswers,
        status,
      });
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5"
      >
        <div>
          <label className="label-caps block">
            Question (title) <span className="text-[#6b6b6b]">*</span>
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={field}
            placeholder="e.g. What is your return policy?"
          />
        </div>

        <div>
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
                <textarea
                  required={i === 0}
                  value={a}
                  onChange={(e) => setAnswerAt(i, e.target.value)}
                  rows={2}
                  className={`min-h-[72px] flex-1 ${field}`}
                  placeholder="Answer text..."
                />
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
            {submitting ? "Saving…" : "Create FAQ"}
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

      {paidPlan && (
        <aside className="rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-lg shadow-black/5">
          <FAQSuggestions
            templates={DEFAULT_FAQ_TEMPLATES}
            onSelect={applySuggestion}
            disabled={submitting}
          />
        </aside>
      )}
    </div>
  );
}
