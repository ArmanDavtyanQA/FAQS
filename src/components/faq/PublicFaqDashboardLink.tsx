"use client";

import Link from "next/link";
import DashboardAreaHeader from "@/components/DashboardAreaHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/** Top bar with ← Dashboard when the viewer is the page owner; nothing otherwise */
export default function PublicFaqDashboardLink({
  ownerUserId,
}: {
  ownerUserId: string;
}) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled && user?.id === ownerUserId) setIsOwner(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setIsOwner(session?.user?.id === ownerUserId);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [ownerUserId]);

  if (!isOwner) return null;

  return (
    <DashboardAreaHeader innerClassName="mx-auto flex max-w-2xl items-center justify-end px-5 py-5">
      <Link
        href="/dashboard"
        className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
      >
        ← Dashboard
      </Link>
    </DashboardAreaHeader>
  );
}
