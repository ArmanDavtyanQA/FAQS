"use client";

import { usePathname } from "next/navigation";
import { parseProjectIdFromPath } from "@/lib/studio/navigation";
import { getProjectTheme } from "@/lib/studio/projectScope";

type Props = {
  title: string;
  breadcrumbs: string[];
};

export default function StudioMainHeader({ title, breadcrumbs }: Props) {
  const pathname = usePathname();
  const projectId = parseProjectIdFromPath(pathname);
  const projectTheme = projectId ? getProjectTheme(projectId) : null;
  const themeLabel =
    projectTheme === "minimalist"
      ? "Minimalist"
      : projectTheme === "branded"
        ? "Branded"
        : projectTheme === "quantum"
          ? "Quantum"
          : null;
  const crumbText = breadcrumbs.join(" / ");

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.08] pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-ui-strong sm:text-3xl">
          {title}
        </h1>
        {themeLabel ? (
          <span
            suppressHydrationWarning
            className="label-caps rounded-full border border-black/[0.08] bg-white/65 px-2.5 py-1 text-ui-muted"
          >
            Theme: {themeLabel}
          </span>
        ) : null}
      </div>
      <p className="label-caps max-w-full pt-1 text-ui-muted" aria-label={`Breadcrumb: ${crumbText}`}>
        {crumbText}
      </p>
    </header>
  );
}
