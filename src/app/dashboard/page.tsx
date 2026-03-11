"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import DashboardFaqSection from "@/components/faq/DashboardFaqSection";

function getPlanLabel(): "free" | "paid" {
  return process.env.NEXT_PUBLIC_FAQ_PLAN === "paid" ? "paid" : "free";
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
          Loading…
        </p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="flex flex-1 flex-col gap-10">
      <div>
        <p className="label-caps mb-2">Dashboard</p>
        <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
          Plan · {plan}
        </p>
      </div>
      <DashboardFaqSection />
    </main>
  );
}
