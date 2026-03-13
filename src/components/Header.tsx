"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

const navLink =
  "interactive-smooth rounded-md px-1 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#0a0a0a]/70 hover:bg-black/[0.05] hover:text-[#0a0a0a]";

const btnBase =
  "btn-shadow-smooth interactive-smooth inline-flex h-9 items-center justify-center rounded-lg px-4 text-[11px] font-medium uppercase tracking-[0.12em]";
const btnGhost = `${btnBase} btn-ghost-edge bg-black/[0.03] text-[#111827]`;
const btnSolid = `${btnBase} btn-ghost-edge bg-black/[0.05] text-[#020617] font-normal`;

export default function Header() {
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

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="interactive-smooth inline-flex items-center px-1 py-0.5">
          <span className="text-xs font-semibold tracking-[0.18em] text-[#0a0a0a]">
            FAQ STUDIO
          </span>
        </Link>

        {!user && (
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/#how-it-works" className={navLink}>
              How it works
            </a>
            <a href="/auth?redirectTo=/dashboard" className={navLink}>
              Sign in
            </a>
          </nav>
        )}

        {loading ? (
          <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
            …
          </span>
        ) : user ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link href="/dashboard" className={btnGhost}>
              Dashboard
            </Link>
            <Link
              href="/dashboard/account"
              className={`${btnGhost} max-w-[160px] truncate`}
              title="Account"
            >
              {displayName}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth?redirectTo=/"
              className={`${btnGhost} hidden md:inline-flex`}
            >
              Log in
            </Link>
            <Link href="/auth?redirectTo=/dashboard" className={btnSolid}>
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
