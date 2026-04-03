"use client";

import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects/types";

const overlaySpring = { type: "spring" as const, stiffness: 400, damping: 38 };
const panelSpring = { type: "spring" as const, stiffness: 360, damping: 30 };
const ov = { closed: { opacity: 0 }, open: { opacity: 1 } };
const pan = {
  closed: { opacity: 0, scale: 0.96, y: 16 },
  open: { opacity: 1, scale: 1, y: 0 },
};

const labelCls =
  "mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-widest text-[#4B5563]";

const fieldCls =
  "w-full rounded-xl border border-black/[0.05] bg-black/[0.03] px-3.5 py-2.5 text-sm text-[#0A0A0A] outline-none transition-[border-color,box-shadow] focus:border-yellow-500/50 focus:shadow-sm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: Project | null;
  onSave: (payload: {
    name: string;
    domain: string;
    description?: string;
  }) => void;
};

export default function ProjectFormModal({
  open,
  onOpenChange,
  mode,
  initial,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [baseline, setBaseline] = useState({ name: "", domain: "", description: "" });

  useEffect(() => {
    if (!open) return;
    const n = initial?.name ?? "";
    const d = initial?.domain ?? "";
    const desc = initial?.description ?? "";
    setName(n);
    setDomain(d);
    setDescription(desc);
    // Baseline must use the same normalization as `dirty` (trimmed compare) so
    // stored whitespace does not trigger false “unsaved changes”.
    setBaseline({
      name: n.trim(),
      domain: d.trim(),
      description: desc.trim(),
    });
  }, [open, initial]);

  const dirty = useMemo(() => {
    return (
      name.trim() !== baseline.name ||
      domain.trim() !== baseline.domain ||
      description.trim() !== baseline.description
    );
  }, [name, domain, description, baseline]);

  const tryClose = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    if (dirty) {
      const ok = window.confirm(
        "You have unsaved changes. Discard project?",
      );
      if (!ok) return;
    }
    onOpenChange(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const u = domain.trim();
    if (!n || !u) return;
    onSave({
      name: n,
      domain: u.replace(/^https?:\/\//i, ""),
      description: description.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={tryClose} modal>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[120] bg-black/10 backdrop-blur-md"
            variants={ov}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={overlaySpring}
          />
        </Dialog.Overlay>
        <Dialog.Content className="fixed inset-0 z-[130] m-0 grid place-items-center border-0 bg-transparent p-4 shadow-none outline-none focus:outline-none pointer-events-none">
          <motion.div
            variants={pan}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={panelSpring}
            className="glass-slab pointer-events-auto w-full max-w-lg rounded-2xl border border-b border-r border-black/[0.1] border-l border-t border-l-white/80 border-t-white/80 p-6 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.12)] backdrop-blur-3xl sm:p-8"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Dialog.Title className="text-xl font-semibold tracking-tight text-[#0A0A0A]">
              {mode === "create" ? "New project" : "Edit project"}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-[#4B5563]">
              {mode === "create"
                ? "Create a workspace for a site or brand. You can open it from the hub anytime."
                : "Update this project’s details."}
            </Dialog.Description>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label htmlFor="pf-name" className={labelCls}>
                  Project name <span className="text-red-600">*</span>
                </label>
                <input
                  id="pf-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldCls}
                  required
                  placeholder="Northwind FAQ"
                />
              </div>
              <div>
                <label htmlFor="pf-url" className={labelCls}>
                  Website URL <span className="text-red-600">*</span>
                </label>
                <input
                  id="pf-url"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={`${fieldCls} font-mono text-[13px]`}
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="pf-desc" className={labelCls}>
                  Description
                </label>
                <textarea
                  id="pf-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${fieldCls} resize-none`}
                  placeholder="Short internal note (optional)"
                />
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => tryClose(false)}
                  className="h-11 rounded-2xl px-5 text-sm font-medium text-[#4B5563] transition-colors hover:bg-black/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-[#0A0A0A] px-6 text-sm font-medium text-white transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_24px_-6px_rgba(234,179,8,0.4)]"
                >
                  {mode === "create" ? "Create project" : "Save changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
