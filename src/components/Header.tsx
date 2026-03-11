"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

const navLink =
  "text-[11px] font-medium uppercase tracking-[0.18em] text-[#0a0a0a]/70 hover:text-[#0a0a0a] transition-colors";

/* No border default; barely visible border on hover */
const btnBase =
  "btn-shadow-smooth inline-flex h-9 items-center justify-center rounded-lg px-4 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors";
const btnGhost = `${btnBase} btn-ghost-edge bg-white text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white hover:border-white/10`;
const btnSolid = `${btnBase} btn-solid-edge bg-[#0a0a0a] text-white hover:bg-[#2a2a2a]`;

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
    <header className="mb-10 rounded-2xl border border-[#e8e6e3] bg-white/90 px-5 py-5 shadow-lg shadow-black/5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Elevated logo */}
        <Link
          href="/"
          className="logo-elevated inline-flex items-center border border-[#e8e6e3] bg-white px-4 py-2.5 transition hover:border-[#0a0a0a]/10"
        >
          <span className="text-sm font-semibold tracking-[0.12em] text-[#0a0a0a]">
            FAQ STUDIO
          </span>
        </Link>

        {!user && (
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/#how-it-works" className={navLink}>
              How it works
            </a>
            <a href="/auth?redirectTo=/dashboard" className={navLink}>
              Sign in
            </a>
          </nav>
        )}

        {loading ? (
          <span className="ml-auto text-[11px] uppercase tracking-widest text-[#6b6b6b]">
            …
          </span>
        ) : user ? (
          /* Dashboard left, Username last on the right */
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
            <Link href="/dashboard" className={btnGhost}>
              Dashboard
            </Link>
            <Link
              href="/dashboard/account"
              className={`${btnGhost} max-w-[180px] truncate`}
              title="Account"
            >
              {displayName}
            </Link>
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-2">
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
