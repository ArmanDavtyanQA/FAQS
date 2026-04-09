"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/** Upper-right ← Dashboard when the viewer owns the public FAQ (inside main card header) */
export default function PublicFaqDashboardLink({
  ownerUserId,
  projectId,
}: {
  ownerUserId: string;
  projectId?: string;
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
    <div className="shrink-0 self-start pt-0.5 text-right">
      <Link
        href={projectId ? `/project/${projectId}/dashboard` : "/studio"}
        className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6B7280] transition-colors hover:text-[#1F1F1F]"
      >
        ← {projectId ? "Project dashboard" : "Studio"}
      </Link>
    </div>
  );
}
