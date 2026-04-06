"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import GlassLogo from "@/components/GlassLogo";

const navLink =
  "label-caps rounded-md px-2 py-1 text-ui-muted transition-colors hover:bg-black/[0.04] hover:text-ui-strong";

const btnBase = "btn-ui px-4";
const btnGhost = `${btnBase} btn-ui-secondary`;
const btnSolid = `${btnBase} btn-ui-primary`;

const headerBar =
  "fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl backdrop-saturate-150";

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
            <Link href="/#how-it-works" className={navLink}>
              How it works
            </Link>
            <Link href="/auth?redirectTo=/dashboard" className={navLink}>
              Sign in
            </Link>
          </nav>
        )}

        {loading ? (
          <span className="label-caps text-ui-subtle">
            …
          </span>
        ) : user ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {!pathname?.startsWith("/studio") &&
              !pathname?.startsWith("/project") && (
                <Link href="/studio" className={btnGhost}>
                  Studio
                </Link>
              )}
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
