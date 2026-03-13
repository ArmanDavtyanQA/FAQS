"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicFaq = pathname?.startsWith("/faq/");

  if (isPublicFaq) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a]">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#0a0a0a]">
      <div className="mx-auto flex min-h-screen w-full max-w-8xl flex-col px-10 pb-20 pt-6 sm:px-6 lg:px-40 lg:pb-24 lg:pt-8">
        <Header />
        {children}
      </div>
    </div>
  );
}
