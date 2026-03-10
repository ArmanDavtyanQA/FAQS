"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <header className="sticky top-3 z-20 mb-4 rounded-full border border-slate-800/80 bg-slate-900/80 px-4 py-2.5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-md sm:top-4 sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-fuchsia-500 to-emerald-400 text-xs font-semibold uppercase tracking-[0.21em] text-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.6)]">
            FAQ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              FAQ Studio
            </span>
            <span className="text-[11px] text-slate-400">
              AI‑assisted FAQ generator
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-medium text-slate-300 md:flex">
          <a href="/#how-it-works" className="hover:text-white">
            How it works
          </a>
          <a href="/#features" className="hover:text-white">
            Features
          </a>
          <a href="/#templates" className="hover:text-white">
            Templates
          </a>
          <a href="/#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="/#faq" className="hover:text-white">
            FAQ
          </a>
          <a href="/#updates" className="hover:text-white">
            Updates
          </a>
          {user && (
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="rounded-full border border-slate-700/90 px-3.5 py-1.5 text-xs text-slate-400">
              Loading…
            </span>
          ) : user ? (
            <>
              <span className="hidden max-w-[140px] truncate rounded-full border border-slate-700/90 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-100 sm:inline-block">
                {displayName}
              </span>
              <Link
                href="/dashboard"
                className="rounded-full border border-slate-700/90 px-3.5 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:text-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth?redirectTo=/"
                className="hidden rounded-full border border-slate-700/90 px-3.5 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:text-white md:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/auth?redirectTo=/"
                className="rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.8)] shadow-sky-500/40 transition hover:brightness-110"
              >
                Start free trial
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
