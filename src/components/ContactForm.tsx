"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type FormState = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "mt-2 w-full rounded-xl border border-black/[0.08] bg-white/75 px-4 py-3 text-sm font-light tracking-[0.06em] text-ui-strong shadow-sm placeholder:text-ui-muted focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15 transition-all duration-300";

type Props = {
  defaultOpen?: boolean;
  redirectTo?: string;
  /**
   * When true, the open form (and success state) render in a fixed popup over the page.
   * Use on public FAQ; omit on full-page contact.
   */
  asModal?: boolean;
  /**
   * When true, do not redirect to /auth if there is no session.
   * Guests see a sign-in link; the FAQ page stays readable without login.
   */
  allowAnonymous?: boolean;
};

export default function ContactForm({
  defaultOpen = false,
  redirectTo = "/dashboard/contact",
  asModal = false,
  allowAnonymous = false,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [authResolved, setAuthResolved] = useState(false);
  const [hasSession, setHasSession] = useState(false);
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

  const isDirty = subject.trim().length > 0 || message.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (allowAnonymous) {
        setHasSession(!!user);
        if (user) setEmail(user.email ?? "");
        setAuthResolved(true);
        return;
      }
      if (!user) {
        router.replace(`/auth?redirectTo=${encodeURIComponent(redirectTo)}`);
        return;
      }
      setEmail(user.email ?? "");
      setAuthResolved(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, redirectTo, allowAnonymous]);

  useEffect(() => {
    if (!allowAnonymous) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session?.user);
      if (session?.user) setEmail(session.user.email ?? "");
    });
    return () => subscription.unsubscribe();
  }, [allowAnonymous]);

  useEffect(() => {
    if (!asModal || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [asModal, open]);

  const requestCloseModal = useCallback(() => {
    if (state === "sending") return;
    if (state === "sent") {
      setOpen(false);
      setState("idle");
      setSubject("");
      setMessage("");
      setError(null);
      return;
    }
    if (!isDirty) {
      setConfirmCancelOpen(false);
      setError(null);
      setSubject("");
      setMessage("");
      setState("idle");
      setOpen(false);
      return;
    }
    setConfirmCancelOpen(true);
  }, [state, isDirty]);

  useEffect(() => {
    if (!asModal || !open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (confirmCancelOpen) {
        setConfirmCancelOpen(false);
        return;
      }
      requestCloseModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [asModal, open, confirmCancelOpen, requestCloseModal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  function handleBackdropClick() {
    if (state === "sending") return;
    if (confirmCancelOpen) {
      setConfirmCancelOpen(false);
      return;
    }
    if (state === "sent") {
      setOpen(false);
      setState("idle");
      setSubject("");
      setMessage("");
      setError(null);
      return;
    }
    handleCancelClick();
  }

  const askQuestionBtnClass =
    "btn-ui btn-ui-secondary inline-flex min-h-11 rounded-2xl px-8 py-3 text-center text-[11px] active:scale-[0.98]";

  const successBlock = (
    <div className="rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl antigravity-lift sm:p-8">
      <p className="label-caps text-[#5A4A40]">Message sent</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0a0a0a]">
        Thanks — we received your message.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#5A4A40]">
        Your form was sent successfully. A manager will contact you soon.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => router.push("/studio")}
          className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
        >
          Back to studio
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
          className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
        >
          Send another message
        </button>
      </div>
    </div>
  );

  const formBlock = (
    <form
      onSubmit={handleSubmit}
      className={
        asModal
          ? "space-y-6"
          : "space-y-6 rounded-2xl border border-[#e8e6e3] border-t-surface/75 bg-surface/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl antigravity-lift sm:p-8"
      }
    >
      <div className="rounded-2xl border border-[#e8e6e3] bg-black/[0.02] p-4 shadow-sm">
        <div>
          <label className="label-caps block">
            Subject <span className="text-[#5A4A40]">*</span>
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
            Message <span className="text-[#5A4A40]">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={asModal ? 5 : 6}
            className={`${fieldClass} min-h-[120px] sm:min-h-[140px]`}
            placeholder="Describe your request…"
          />
        </div>
      </div>

      {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={state === "sending"}
          className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const authHref = `/auth?redirectTo=${encodeURIComponent(redirectTo)}`;

  if (allowAnonymous && !authResolved) {
    return (
      <div className="inline-flex min-h-11 items-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A4A40]">
          Loading…
        </span>
      </div>
    );
  }

  if (allowAnonymous && !hasSession) {
    return (
      <Link href={authHref} className={askQuestionBtnClass}>
        Sign in to ask a question
      </Link>
    );
  }

  if (state === "sent" && !asModal) {
    return successBlock;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={askQuestionBtnClass}
      >
        Ask a question
      </button>
    );
  }

  if (asModal) {
    return (
      <>
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            disabled={state === "sending"}
            onClick={handleBackdropClick}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            className="relative z-[1] flex max-h-[min(90dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e8e6e3] px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="contact-form-title"
                  className="text-lg font-semibold tracking-tight text-[#0a0a0a]"
                >
                  {state === "sent" ? "Message sent" : "Ask a question"}
                </h2>
              </div>
              <button
                type="button"
                disabled={state === "sending"}
                onClick={() => {
                  if (state === "sent") {
                    setOpen(false);
                    setState("idle");
                    setSubject("");
                    setMessage("");
                    setError(null);
                    return;
                  }
                  requestCloseModal();
                }}
                className="interactive-smooth flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#5A4A40] transition-colors hover:bg-surface-muted hover:text-[#0a0a0a] disabled:opacity-45"
                aria-label="Close"
              >
                <span className="text-2xl leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {state === "sent" ? (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-[#5A4A40]">
                    Thanks — we received your message. A manager will contact
                    you soon.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => router.push("/studio")}
                      className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
                    >
                      Back to studio
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSubject("");
                        setMessage("");
                        setState("idle");
                      }}
                      className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-[#0a0a0a] px-6 text-[11px] font-light uppercase tracking-widest text-white shadow-sm transition-all duration-300 hover:bg-[#262626]"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                formBlock
              )}
            </div>
          </div>
        </div>

        {confirmCancelOpen && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center px-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setConfirmCancelOpen(false)}
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
              <div className="p-6">
                <p className="label-caps text-[#5A4A40]">Confirm cancellation</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]">
                  Discard this message?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A4A40]">
                  If you confirm, all entered data will be lost.
                </p>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmCancelOpen(false)}
                    className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
                  >
                    Keep editing
                  </button>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
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

  return (
    <>
      {formBlock}
      {confirmCancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setConfirmCancelOpen(false)}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
            <div className="p-6">
              <p className="label-caps text-[#5A4A40]">Confirm cancellation</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]">
                Discard this message?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5A4A40]">
                If you confirm, all entered data will be lost.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmCancelOpen(false)}
                  className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-all duration-300 hover:bg-surface-muted"
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
