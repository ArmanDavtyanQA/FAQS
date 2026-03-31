"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import DashboardAreaHeader from "@/components/DashboardAreaHeader";
import DashboardSpinner from "@/components/DashboardSpinner";
import DashboardFaqSection from "@/components/faq/DashboardFaqSection";

function getPlanLabel(): "free" | "paid" {
  return process.env.NEXT_PUBLIC_FAQ_PLAN === "paid" ? "paid" : "free";
}

function DashboardChrome({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 min-h-[calc(100dvh-6rem)] bg-transparent text-[#0a0a0a] sm:-mx-6 lg:-mx-10">
      <DashboardAreaHeader>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0a0a0a]">
          Dashboard
        </span>
        <Link
          href="/"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          Home
        </Link>
      </DashboardAreaHeader>
      <main className="mx-auto max-w-5xl px-5 py-14">{children}</main>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const plan = getPlanLabel();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) router.replace("/auth?redirectTo=/dashboard");
    });
  }, [router]);

  if (loading) {
    return (
      <DashboardChrome>
        <div className="flex min-h-[40vh] items-center justify-center py-16">
          <DashboardSpinner label="Loading dashboard…" />
        </div>
      </DashboardChrome>
    );
  }
  if (!user) return null;

  return (
    <DashboardChrome>
      <p className="label-caps mb-4">Your workspace</p>
      <h1 className="text-3xl font-normal tracking-tight text-[#0a0a0a]">
        FAQs
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
        Plan · {plan}
      </p>
      <div className="mt-10">
        <DashboardFaqSection />
      </div>
    </DashboardChrome>
  );
}
