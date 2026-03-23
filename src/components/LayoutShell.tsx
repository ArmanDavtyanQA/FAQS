"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

/** Matches public FAQ chrome: no site header, normal top padding */
function isPublishedStyleDashboardPage(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/dashboard" ||
    pathname === "/dashboard/faq/create" ||
    pathname === "/dashboard/faq/topics"
  );
}

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicFaq = pathname?.startsWith("/faq/");
  const publishedStyleDash = isPublishedStyleDashboardPage(pathname);

  if (isPublicFaq) {
    return (
      <div className="min-h-screen bg-transparent text-[#0a0a0a]">{children}</div>
    );
  }

  // Clears fixed header: page top inset + bar row + header bottom pad + former mb-8 gap
  const mainTop =
    "pt-[calc(1.5rem+3rem+1rem+2rem)] lg:pt-[calc(2.5rem+3rem+1rem+2rem)]";
  const mainPadNoHeader = "pt-6 lg:pt-10";

  return (
    <div className="min-h-screen bg-transparent text-[#0a0a0a]">
      {!publishedStyleDash && <Header />}
      <div
        className={`mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24 ${
          publishedStyleDash ? mainPadNoHeader : mainTop
        }`}
      >
        {children}
      </div>
    </div>
  );
}
