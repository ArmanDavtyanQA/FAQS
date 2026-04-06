"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MoreVertical, Plus } from "lucide-react";
import { useProjects } from "@/components/providers/ProjectsProvider";
import type { Project } from "@/lib/projects/types";
import ProjectFormModal from "@/components/studio/ProjectFormModal";
import DeleteProjectModal from "@/components/studio/DeleteProjectModal";

export default function StudioProjectsHub() {
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("[data-project-menu]")) return;
      setMenuId(null);
    };
    if (menuId) document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [menuId]);

  const openCreate = () => {
    setFormMode("create");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (p: Project) => {
    setMenuId(null);
    setFormMode("edit");
    setEditing(p);
    setFormOpen(true);
  };

  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-10 md:px-10 md:pt-12">
      <ProjectFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSave={(payload) => {
          if (formMode === "create") {
            addProject({
              name: payload.name,
              domain: payload.domain,
              description: payload.description,
            });
          } else if (editing) {
            updateProject(editing.id, payload);
          }
        }}
      />
      <DeleteProjectModal
        project={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeProject(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />

      <header className="flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ui-strong sm:text-4xl">
            Project Studio
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ui-muted sm:text-base">
            Open a workspace to manage FAQs, analytics, templates, and orders
            for each site.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:pt-1">
          <Link
            href="/"
            prefetch
            className="label-caps text-ui-muted underline-offset-4 transition-colors hover:text-ui-strong hover:underline"
          >
            Site home
          </Link>
          <span className="hidden text-[#D1D5DB] sm:inline" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={openCreate}
            className="btn-ui btn-ui-primary rounded-xl px-4 py-2.5 shadow-sm transition-[transform,box-shadow] hover:scale-[1.02]"
          >
            New project
          </button>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="panel-base mt-14 rounded-2xl border border-dashed border-black/[0.12] bg-black/[0.02] px-6 py-14 text-center sm:py-20">
          <p className="label-caps text-ui-subtle">
            No projects yet
          </p>
          <p className="mt-3 text-sm text-ui-muted">
            Create a workspace to manage FAQs and templates for a site.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="btn-ui btn-ui-primary mt-8 inline-flex h-11 rounded-xl px-8 transition-[transform,box-shadow] hover:scale-[1.02]"
          >
            Create project
          </button>
        </div>
      ) : null}

      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-3 ${
          projects.length === 0 ? "mt-0 hidden" : "mt-12"
        }`}
      >
        {projects.map((p) => (
          <article
            key={p.id}
            className="group/card relative rounded-2xl shadow-[20px_0_50px_rgba(0,0,0,0.02)]"
          >
            <div
              className="glass-slab antigravity-lift relative overflow-hidden rounded-2xl border border-r border-black/[0.04] text-left transition-[border-color] group-hover/card:border-black/[0.1]"
            >
              {/* Stretched hit target: primary navigation (dashboard) */}
              <Link
                href={`/project/${p.id}/dashboard`}
                prefetch
                className="absolute inset-0 z-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-500/40"
                aria-label={`Open ${p.name} — dashboard`}
              />
              <div className="pointer-events-none relative z-[1] border-b border-black/[0.06] px-5 pb-4 pt-5 pr-14">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold tracking-tight text-ui-strong">
                    {p.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs tracking-[0.08em] text-ui-muted">
                    {p.domain}
                  </p>
                </div>
                {p.description ? (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ui-subtle">
                    {p.description}
                  </p>
                ) : null}
              </div>
              <div className="pointer-events-none relative z-[1] flex items-center justify-between gap-3 px-5 py-3">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ui-subtle">
                  Updated {timeFormat(p.updatedAt)}
                </span>
                <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#B45309] group-hover/card:text-[#92400E]">
                  Open
                  <ChevronRight
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>
              <nav
                className="relative z-10 flex flex-wrap gap-1 border-t border-black/[0.06] bg-black/[0.025] px-2 py-2"
                aria-label={`Shortcuts for ${p.name}`}
              >
                {(
                  [
                    ["FAQ", `/project/${p.id}/faq`],
                    ["Analytics", `/project/${p.id}/analytics`],
                    ["Templates", `/project/${p.id}/templates`],
                    ["Orders", `/project/${p.id}/orders`],
                  ] as const
                ).map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    className="rounded-lg px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ui-muted transition-colors hover:bg-white/55 hover:text-ui-strong"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <button
              type="button"
              className="absolute right-4 top-4 z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-white/80 text-ui-muted shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-ui-strong"
              aria-label={`More actions for ${p.name}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const r = e.currentTarget.getBoundingClientRect();
                setMenuPos({
                  top: r.bottom + 4,
                  left: r.right - 160,
                });
                setMenuId(p.id);
              }}
            >
              <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </article>
        ))}
      </div>

      {mounted && menuId
        ? createPortal(
            <motion.div
              data-project-menu
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[50] min-w-[160px] overflow-hidden rounded-xl border border-b border-r border-black/[0.1] border-l border-t border-l-white/75 border-t-white/90 bg-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
                {projects
                  .filter((q) => q.id === menuId)
                  .map((p) => (
                    <div key={p.id}>
                      <button
                        type="button"
                        className="flex w-full px-3 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ui-strong hover:bg-white/60"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>
                      <div className="mx-2 h-px bg-black/[0.06]" />
                      <button
                        type="button"
                        className="flex w-full px-3 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-red-700 hover:bg-red-500/[0.06]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuId(null);
                          setDeleteTarget(p);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
            </motion.div>,
            document.body,
          )
        : null}

      <button
        type="button"
        onClick={openCreate}
        className="btn-ui btn-ui-primary fixed bottom-10 right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg outline-none transition-[box-shadow,transform] hover:scale-[1.04] active:scale-[0.98]"
        aria-label="New project"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  );
}

function timeFormat(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
