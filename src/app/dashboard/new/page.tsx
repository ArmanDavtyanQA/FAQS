"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewFaqPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/auth?redirectTo=/dashboard/new");
    });
  }, [router]);

  return (
    <main className="mt-8 flex flex-1 flex-col gap-10">
      <div>
        <Link
          href="/dashboard"
          className="text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Create new FAQ page
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Set up a new FAQ space with its own link and widget.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-800/80 border-dashed bg-slate-950/60 p-12 text-center">
        <p className="text-sm text-slate-400">
          FAQ creation flow coming soon. You’ll be able to name your FAQ, pick a
          template, and get your unique link and embed code here.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-xs font-medium text-slate-200 hover:border-slate-500"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
