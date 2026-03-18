"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type FormState = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#e8e6e3] bg-white px-4 py-3 text-sm text-[#0a0a0a] shadow-sm placeholder:text-[#6b6b6b] focus:border-[#0a0a0a] focus:shadow-md focus:outline-none";

type Props = {
  defaultOpen?: boolean;
  redirectTo?: string;
};

export default function ContactForm({
  defaultOpen = false,
  redirectTo = "/dashboard/contact",
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const canSubmit = useMemo(() => {
    if (state === "sending" || state === "sent") return false;
    if (!subject.trim()) return false;
    if (!message.trim()) return false;
    return true;
  }, [subject, message, state]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace(`/auth?redirectTo=${encodeURIComponent(redirectTo)}`);
        return;
      }
      setEmail(user.email ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/auth?redirectTo=${encodeURIComponent(redirectTo)}`);
        return;
      }

      const { error: insertError } = await supabase
        .from("contact_requests")
        .insert({
          user_id: user.id,
          email: (user.email ?? email).trim(),
          subject: subject.trim(),
          message: message.trim(),
        });

      if (insertError) throw new Error(insertError.message);

      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
        <p className="label-caps text-[#6b6b6b]">Message sent</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0a0a0a]">
          Thanks — we received your message.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
          Your form was sent successfully. A manager will contact you soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617]"
          >
            Back to dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setSubject("");
              setMessage("");
              setState("idle");
              setOpen(true);
            }}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const isDirty = subject.trim().length > 0 || message.trim().length > 0;

  function resetAndClose() {
    setConfirmCancelOpen(false);
    setError(null);
    setSubject("");
    setMessage("");
    setState("idle");
    setOpen(false);
  }

  function handleCancelClick() {
    if (state === "sending") return;
    if (!isDirty) {
      resetAndClose();
      return;
    }
    setConfirmCancelOpen(true);
  }

  if (!open) {
    return (
      <div className="rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617]"
        >
          Ask a question
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e8e6e3] bg-white p-6 shadow-xl shadow-black/5 sm:p-8"
      >
        <div className="rounded-2xl border border-[#e8e6e3] bg-[#f9f9f7] p-4 shadow-sm">
          <div>
            <label className="label-caps block">
              Subject <span className="text-[#6b6b6b]">*</span>
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={fieldClass}
              placeholder="How can we help?"
            />
          </div>

          <div className="mt-5">
            <label className="label-caps block">
              Message <span className="text-[#6b6b6b]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={`${fieldClass} min-h-[160px]`}
              placeholder="Describe your request…"
            />
          </div>
        </div>

        {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617] disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : "Send"}
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={state === "sending"}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {confirmCancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setConfirmCancelOpen(false)}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
            <div className="p-6">
              <p className="label-caps text-[#6b6b6b]">Confirm cancellation</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]">
                Discard this message?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                If you confirm, all entered data will be lost.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmCancelOpen(false)}
                  className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.05] px-6 text-[11px] font-medium uppercase tracking-widest text-[#020617]"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

