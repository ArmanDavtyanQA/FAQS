"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects/types";

const overlaySpring = { type: "spring" as const, stiffness: 420, damping: 40 };
const ov = { closed: { opacity: 0 }, open: { opacity: 1 } };
const pan = {
  closed: { opacity: 0, scale: 0.94, y: 12 },
  open: { opacity: 1, scale: 1, y: 0 },
};

type Props = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function DeleteProjectModal({
  project,
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
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
            transition={overlaySpring}
            className="panel-base glass-slab pointer-events-auto w-full max-w-md rounded-2xl p-6 shadow-[0_40px_100px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-8"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Dialog.Title className="text-lg font-semibold text-ui-strong">
              Delete project?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-ui-muted">
              {project
                ? `“${project.name}” and its studio shortcuts will be removed from this device. This cannot be undone.`
                : "This project will be removed."}
            </Dialog.Description>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="btn-ui btn-ui-ghost h-11 rounded-2xl px-5 text-sm"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                className="btn-ui btn-ui-danger h-11 rounded-2xl px-6 text-sm shadow-sm"
              >
                Delete project
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
