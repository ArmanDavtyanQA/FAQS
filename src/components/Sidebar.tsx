"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useActivePath } from "@/hooks/useActivePath";
import {
  getProjectStudioNav,
  parseProjectIdFromPath,
} from "@/lib/studio/navigation";
import { useProject } from "@/components/providers/ProjectsProvider";

const ACTIVE_BAR =
  "absolute left-0 top-1/2 h-9 w-[2px] -translate-y-1/2 rounded-full bg-yellow-500 shadow-[4px_0_15px_rgba(234,179,8,0.4)]";

const navLabel =
  "font-mono text-[12px] font-medium uppercase tracking-[0.14em]";

/** Studio hub nav when not inside `/project/[id]/…`. */
const HUB_NAV: { id: string; href: string; label: string }[] = [
  { id: "projects", href: "/studio", label: "Projects" },
];

function projectIdFromParams(
  params: ReturnType<typeof useParams> | null,
): string | null {
  const raw = params?.id;
  if (typeof raw === "string" && raw.length > 0) return raw;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return null;
}

export default function Sidebar() {
  const params = useParams();
  const { pathname, isActive } = useActivePath();
  const [sheetOpen, setSheetOpen] = useState(false);

  const projectId = useMemo(
    () => projectIdFromParams(params) ?? parseProjectIdFromPath(pathname),
    [params, pathname],
  );

  const activeProject = useProject(projectId);
  const inProjectContext = Boolean(projectId);
  const navItems = inProjectContext
    ? getProjectStudioNav(projectId!)
    : HUB_NAV;
  const layoutGroupId = `sidebar-nav-${projectId ?? "hub"}`;

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const projectLabel = activeProject?.name ?? "Active project";

  return (
    <>
      <button
        type="button"
        className={`fixed left-4 top-4 z-[45] flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.06] bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md transition-opacity md:hidden ${
          sheetOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Open navigation"
        aria-expanded={sheetOpen}
        onClick={() => setSheetOpen(true)}
      >
        <Menu className="h-5 w-5 text-[#4B5563]" strokeWidth={1.75} />
      </button>

      {sheetOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[35] bg-black/[0.18] backdrop-blur-[2px] md:hidden"
          aria-label="Close navigation"
          onClick={() => setSheetOpen(false)}
        />
      )}

      <aside
        className={`glass-slab fixed left-0 top-0 z-40 flex h-[100dvh] w-72 flex-col border-r border-black/[0.03] shadow-[20px_0_50px_rgba(0,0,0,0.02)] transition-[transform] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] max-md:-translate-x-full ${
          sheetOpen ? "max-md:translate-x-0" : ""
        } md:translate-x-0`}
        aria-label="Primary navigation"
      >
        <div className="flex items-start justify-between gap-2 px-5 py-5">
          <div className="min-w-0 flex-1">
            {inProjectContext ? (
              <div className="border-b border-black/[0.03] pb-4 mb-4">
                <Link
                  href="/studio"
                  className="label-caps inline-block text-ui-muted transition-colors hover:text-ui-strong"
                  onClick={() => setSheetOpen(false)}
                >
                  ← All Projects
                </Link>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={projectId}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{
                      duration: 0.32,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                    className="mt-3 flex items-start gap-2"
                  >
                    <span
                      className="mt-[6px] inline-block shrink-0 rounded-full bg-yellow-500 shadow-sm"
                      style={{ width: 4, height: 4 }}
                      aria-hidden
                    />
                    <Link
                      href={`/project/${projectId}/dashboard`}
                      className="line-clamp-2 min-w-0 font-mono text-[10px] font-bold uppercase leading-snug tracking-[0.16em] text-ui-strong transition-colors hover:text-ui-strong/85"
                      onClick={() => setSheetOpen(false)}
                    >
                      {projectLabel}
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/studio"
                className={`${navLabel} inline-block min-w-0 text-[#4B5563] transition-colors hover:text-[#0A0A0A]`}
                onClick={() => setSheetOpen(false)}
              >
                Quantum Studio
              </Link>
            )}
          </div>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-[#4B5563] transition-colors hover:bg-black/[0.04] hover:text-[#0A0A0A] md:hidden"
            aria-label="Close menu"
            onClick={() => setSheetOpen(false)}
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <LayoutGroup id={layoutGroupId}>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch
                  onClick={() => setSheetOpen(false)}
                  className="group relative flex w-full items-center rounded-xl py-3 pl-4 pr-3 transition-colors hover:bg-black/[0.02]"
                >
                  {active ? (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      className={ACTIVE_BAR}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 34,
                        mass: 0.6,
                      }}
                    />
                  ) : null}
                  <motion.span
                    className={`relative pl-3 ${navLabel} ${
                      active ? "text-ui-strong" : "text-ui-muted"
                    }`}
                    whileHover={{ x: 4 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                    }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="border-t border-black/[0.06] px-4 py-4">
          <Link
            href="/"
            prefetch
            className={`${navLabel} text-[#4B5563] transition-colors hover:text-[#0A0A0A]`}
            onClick={() => setSheetOpen(false)}
          >
            ← Site home
          </Link>
        </div>
      </aside>
    </>
  );
}
