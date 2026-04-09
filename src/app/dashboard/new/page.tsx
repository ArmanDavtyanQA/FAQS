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
          href="/studio"
          className="text-[11px] font-medium uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Back to Studio
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#0a0a0a] sm:text-3xl">
          Create new FAQ page
        </h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Set up a new FAQ space with its own link and widget.
        </p>
      </div>

      <section className="rounded-2xl border border-dashed border-[#e8e6e3] bg-[#f7f6f3] p-12 text-center shadow-lg shadow-black/5">
        <p className="text-sm text-[#6b6b6b]">
          FAQ creation flow coming soon. You’ll be able to name your FAQ, pick a
          template, and get your unique link and embed code here.
        </p>
        <Link
          href="/studio"
          className="btn-shadow-smooth btn-ghost-edge interactive-smooth mt-6 inline-block rounded-xl bg-black/[0.05] px-5 py-2 text-[11px] font-medium uppercase tracking-widest text-[#020617]"
        >
          Back to Studio
        </Link>
      </section>
    </main>
  );
}
