"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

/** Power-off symbol (line + arc), reads as TV/device power */
function PowerOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3v9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.36 6.64a9 9 0 1 1-12.72 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        router.replace("/auth?redirectTo=/dashboard/account");
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

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

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture;

  return (
    <main className="flex flex-1 flex-col gap-10">
      <div>
        <Link
          href="/studio"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Studio
        </Link>
        <p className="label-caps mt-6">Account</p>
      </div>
      <section className="rounded-2xl border border-[#e8e6e3] bg-surface p-8 shadow-xl shadow-black/5">
        <div className="flex flex-wrap items-center gap-8">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="btn-shadow-smooth h-20 w-20 rounded-2xl border border-[#e8e6e3] object-cover"
            />
          ) : (
            <div className="btn-shadow-smooth flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface-muted text-2xl font-light text-[#6b6b6b]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-medium text-[#0a0a0a]">{displayName}</p>
            <p className="text-sm text-[#6b6b6b]">{user.email}</p>
            <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
              Google
            </p>
          </div>
        </div>

        {/* Log out with power-off icon — smooth shadow button */}
        <div className="mt-10 border-t border-[#e8e6e3] pt-8">
          <p className="label-caps mb-4">Session</p>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex items-center gap-2 rounded-lg bg-surface px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#0a0a0a]"
          >
            <PowerOffIcon className="shrink-0 opacity-80" />
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}
