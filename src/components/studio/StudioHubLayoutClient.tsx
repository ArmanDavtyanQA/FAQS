"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DashboardSpinner from "@/components/DashboardSpinner";

export default function StudioHubLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session) {
        router.replace(
          `/auth?redirectTo=${encodeURIComponent(pathname || "/studio")}`,
        );
        return;
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#FDFDFB]">
        <DashboardSpinner label="Opening studio…" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FDFDFB] text-[#0a0a0a]">{children}</div>
  );
}
