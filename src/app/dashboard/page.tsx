"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        router.replace("/auth?redirectTo=/dashboard");
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-400">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture;

  return (
    <main className="mt-8 flex flex-1 flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your FAQ pages and account
        </p>
      </div>

      <section className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          Your account
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-16 w-16 rounded-2xl border border-slate-700/80 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700/80 bg-gradient-to-br from-sky-500/30 via-fuchsia-500/30 to-emerald-500/30 text-2xl font-semibold text-slate-200">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-100">{displayName}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-[11px] text-slate-500">
              Signed in with Google
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          FAQ pages
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Create and manage your branded FAQ pages. Each page gets a unique
          link and an embeddable widget for your website.
        </p>
        <Link
          href="/dashboard/new"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_22px_55px_rgba(56,189,248,0.5)] transition hover:brightness-110"
        >
          <span className="text-lg" aria-hidden>
            +
          </span>
          Create new FAQ page
        </Link>
      </section>
    </main>
  );
}
