"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { getStudioPageMeta } from "@/lib/studio/navigation";
import DashboardSpinner from "@/components/DashboardSpinner";
import Layout from "@/components/Layout";
import StudioMainHeader from "@/components/studio/StudioMainHeader";

export default function StudioLayoutClient({
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
        const next = pathname || "/studio/faq";
        router.replace(
          `/auth?redirectTo=${encodeURIComponent(next)}`,
        );
        return;
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  const meta = getStudioPageMeta(pathname);

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#FDFDFB]">
        <DashboardSpinner label="Opening studio…" />
      </div>
    );
  }

  return (
    <Layout>
      <StudioMainHeader title={meta.title} breadcrumbs={meta.breadcrumbs} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.28,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
