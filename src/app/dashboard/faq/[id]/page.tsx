"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbGetFaqById } from "@/lib/faq/supabase-faq";
import type { FAQ } from "@/lib/faq/types";
import FAQDetailForm from "@/components/faq/FAQDetailForm";
import DashboardAreaHeader from "@/components/DashboardAreaHeader";
import DashboardSpinner from "@/components/DashboardSpinner";

export default function FaqDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : null;
  const projectId = searchParams.get("projectId")?.trim() || null;
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
          const backTo = projectId
            ? `/dashboard/faq/${id}?projectId=${encodeURIComponent(projectId)}`
            : `/dashboard/faq/${id}`;
          router.replace(`/auth?redirectTo=${encodeURIComponent(backTo)}`);
          return;
        }
        const row = await dbGetFaqById(supabase, id, projectId ?? undefined);
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
  }, [id, projectId, router]);

  if (loading) {
    return (
      <main className="mt-8 flex min-h-[40vh] items-center justify-center">
        <DashboardSpinner label="Loading FAQ…" />
      </main>
    );
  }

  if (error || !faq) {
    return (
      <main className="flex flex-1 flex-col gap-6">
        <DashboardAreaHeader innerClassName="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href={projectId ? `/project/${projectId}/dashboard` : "/studio"}
            className="btn-ui btn-ui-ghost h-10 px-3"
          >
            ← Dashboard
          </Link>
        </DashboardAreaHeader>
        <div className="mx-auto w-full max-w-5xl">
          <p className="panel-base rounded-2xl px-4 py-3 text-sm text-ui-strong">
            {error ?? "Not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <DashboardAreaHeader innerClassName="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ui-strong">
            Edit FAQ
          </h1>
          <p className="mt-1 text-sm text-ui-muted">
            Edit question, answers, and publish status.
          </p>
        </div>
        <Link
          href={projectId ? `/project/${projectId}/dashboard` : "/studio"}
          className="btn-ui btn-ui-ghost h-10 px-3"
        >
          ← Dashboard
        </Link>
      </DashboardAreaHeader>
      <div className="mx-auto w-full max-w-5xl">
        <FAQDetailForm faq={faq} />
      </div>
    </main>
  );
}
