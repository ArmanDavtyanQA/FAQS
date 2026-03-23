"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import GlassLogo from "@/components/GlassLogo";

const navLink =
  "interactive-smooth rounded-md px-1 py-0.5 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a]/70 hover:bg-white/[0.05] hover:text-[#0a0a0a] transition-all";

const btnBase =
  "btn-shadow-smooth interactive-smooth inline-flex h-9 items-center justify-center rounded-lg px-4 text-[11px] font-light uppercase tracking-widest bg-white/[0.01] backdrop-blur-[30px] border-t border-l border-white/60 border-b border-r border-black/[0.03] text-black/80 transition-all duration-500 hover:bg-white/[0.05] hover:-translate-y-0.5";
const btnGhost = `${btnBase}`;
const btnSolid = `${btnBase} font-light`;

const headerBar =
  "fixed inset-x-0 top-0 z-50 border-b border-[#e8e6e3]/70 bg-[#FDFDFB]/68 shadow-[0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl backdrop-saturate-150";

const headerInner =
  "mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-6 lg:px-10";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  // Avoid SSR/CSR pathname differences causing hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  // Avoid flashing the unauthenticated nav (How it works / Sign in) before
  // the client has hydrated and we have a real session value.
  if (!mounted) {
    return (
      <header className={headerBar}>
        <div className={headerInner}>
          <GlassLogo />
        </div>
      </header>
    );
  }

  return (
    <header className={headerBar}>
      <div className={headerInner}>
        <GlassLogo />

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
            {pathname !== "/dashboard" && (
              <Link href="/dashboard" className={btnGhost}>
                Dashboard
              </Link>
            )}
            <Link
              href="/dashboard/account"
              className={`${btnGhost} max-w-[160px] truncate`}
              title="Account"
            >
              My account
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
