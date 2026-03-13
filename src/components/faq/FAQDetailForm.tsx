"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbUpdateFaq } from "@/lib/faq/supabase-faq";
import type { FAQ } from "@/lib/faq/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e8e6e3] bg-white px-4 py-3 text-sm text-[#0a0a0a] shadow-sm placeholder:text-[#6b6b6b] focus:border-[#0a0a0a] focus:shadow-md focus:outline-none";

export default function FAQDetailForm({ faq: initial }: { faq: FAQ }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [answers, setAnswers] = useState<string[]>(
    initial.answers.length ? initial.answers : [""],
  );
  const [status, setStatus] = useState<"draft" | "published">(initial.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const trimmed = answers.map((a) => a.trim()).filter(Boolean);
      const updated = await dbUpdateFaq(supabase, initial.id, {
        title: title.trim(),
        answers: trimmed,
        status,
      });
      setTitle(updated.title);
      setAnswers(updated.answers.length ? updated.answers : [""]);
      setStatus(updated.status);
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

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-caps">
            Created
          </p>
          <p className="mt-1 text-sm text-[#0a0a0a]">
            {formatDate(initial.createdAt)}
          </p>
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

      <div>
        <label className="label-caps block">
          Question
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="label-caps">Answers</label>
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
                value={a}
                onChange={(e) => setAnswerAt(i, e.target.value)}
                rows={3}
                className={`min-h-[80px] flex-1 ${inputClass}`}
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

      {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
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
  );
}
