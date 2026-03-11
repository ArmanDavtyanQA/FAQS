"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbGetFaqById } from "@/lib/faq/supabase-faq";
import type { FAQ } from "@/lib/faq/types";
import FAQDetailForm from "@/components/faq/FAQDetailForm";

export default function FaqDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/auth?redirectTo=/dashboard");
          return;
        }
        const row = await dbGetFaqById(supabase, id);
        if (cancelled) return;
        if (!row || row.userId !== user.id) {
          setError("FAQ not found or access denied.");
          setFaq(null);
        } else {
          setFaq(row);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load FAQ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) {
    return (
      <main className="mt-8 flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-[#6b6b6b]">Loading…</p>
      </main>
    );
  }

  if (error || !faq) {
    return (
      <main className="flex flex-1 flex-col gap-6">
        <Link
          href="/dashboard"
          className="text-[11px] font-medium uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Dashboard
        </Link>
        <p className="text-sm text-[#0a0a0a]">{error ?? "Not found"}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="text-[11px] font-medium uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0a0a0a]">
          Edit FAQ
        </h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Edit question, answers, and publish status.
        </p>
      </div>
      <FAQDetailForm faq={faq} />
    </main>
  );
}
