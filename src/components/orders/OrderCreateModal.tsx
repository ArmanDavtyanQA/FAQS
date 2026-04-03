"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import type { OrderRow, OrderStatus } from "@/components/orders/types";

const labelCls =
  "mb-2 block font-mono text-[10px] font-medium uppercase tracking-widest text-[#4B5563]";

const fieldCls =
  "h-11 w-full rounded-xl border border-black/[0.05] bg-black/[0.03] px-3.5 text-sm font-medium text-[#0A0A0A] shadow-none outline-none transition-[border-color,box-shadow] placeholder:text-[#9CA3AF] focus:border-yellow-500/50 focus:shadow-sm";

const overlaySpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.65,
};

const panelSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.72,
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const panelVariants = {
  closed: { opacity: 0, scale: 0.94, y: 28 },
  open: { opacity: 1, scale: 1, y: 0 },
};

function formatPaymentFromAmount(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned || "0");
  if (Number.isNaN(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type OrderCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (order: OrderRow) => void;
};

export default function OrderCreateModal({
  open,
  onOpenChange,
  onCreate,
}: OrderCreateModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setDate(todayISO());
    setStatus("pending");
    setAmount("");
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const row: OrderRow = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `ord_${crypto.randomUUID()}`
          : `ord_${Date.now()}`,
      name: trimmed,
      date,
      status,
      payment: formatPaymentFromAmount(amount),
    };
    onCreate?.(row);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/10 backdrop-blur-md"
            variants={overlayVariants}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={overlaySpring}
          />
        </Dialog.Overlay>
        <Dialog.Content className="fixed inset-0 z-[90] m-0 grid place-items-center border-0 bg-transparent p-4 shadow-none outline-none focus:outline-none pointer-events-none">
          <motion.div
            variants={panelVariants}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={panelSpring}
            className="glass-slab pointer-events-auto w-full max-w-[500px] rounded-2xl border border-b border-r border-black/[0.08] border-l border-t border-l-white/80 border-t-white/80 p-6 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.1)] backdrop-blur-3xl sm:p-8"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Dialog.Title className="text-xl font-semibold tracking-tight text-[#0A0A0A]">
              Create order
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm leading-relaxed text-[#6B7280]">
              Add a new entry to your ledger. All fields inform how this row
              appears in the grid.
            </Dialog.Description>

            <form className="mt-6 space-y-5" onSubmit={submit}>
              <div>
                <label htmlFor="order-name" className={labelCls}>
                  Name
                </label>
                <input
                  id="order-name"
                  name="name"
                  type="text"
                  autoComplete="organization"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldCls}
                  placeholder="Customer or account"
                />
              </div>

              <div>
                <label htmlFor="order-date" className={labelCls}>
                  Date
                </label>
                <input
                  id="order-date"
                  name="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${fieldCls} font-mono tabular-nums`}
                />
              </div>

              <div>
                <label htmlFor="order-status" className={labelCls}>
                  Status
                </label>
                <select
                  id="order-status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className={`${fieldCls} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat font-mono text-[12px] uppercase tracking-[0.12em] pr-10`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div>
                <label htmlFor="order-amount" className={labelCls}>
                  Payment amount
                </label>
                <input
                  id="order-amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${fieldCls} tabular-nums`}
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="h-11 rounded-2xl px-5 text-sm font-medium text-[#4B5563] outline-none transition-colors hover:bg-black/[0.04] hover:text-[#0A0A0A] focus-visible:ring-2 focus-visible:ring-yellow-500/35"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-[#0A0A0A] px-6 text-sm font-medium text-white outline-none transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_28px_-6px_rgba(234,179,8,0.45),0_10px_28px_rgba(0,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-yellow-500/40 active:scale-[0.99]"
                >
                  Create order
                </button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
