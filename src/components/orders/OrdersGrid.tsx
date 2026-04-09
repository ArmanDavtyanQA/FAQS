"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import OrderCreateModal from "@/components/orders/OrderCreateModal";
import type { OrderRow, OrderStatus } from "@/components/orders/types";

export type { OrderRow, OrderStatus } from "@/components/orders/types";

export type OrdersGridProps = {
  projectId?: string;
  orders?: OrderRow[];
  onCreateOrder?: (order: OrderRow) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const headerCell =
  "px-4 pb-3 pt-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ui-muted";

const pillBase =
  "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] backdrop-blur-md";

const statusStyles: Record<OrderStatus, string> = {
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  canceled: "border-red-500/20 bg-red-500/10 text-red-700",
};

const statusLabel: Record<OrderStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  canceled: "Canceled",
};

export const MOCK_ORDERS: OrderRow[] = [
  {
    id: "ord_01",
    name: "Northwind Linen Co.",
    date: "2026-03-28",
    status: "paid",
    payment: "Amex ·••• 1002",
  },
  {
    id: "ord_02",
    name: "Studio Meridian",
    date: "2026-03-27",
    status: "pending",
    payment: "ACH · Business",
  },
  {
    id: "ord_03",
    name: "Bloom & Wire Ltd.",
    date: "2026-03-26",
    status: "paid",
    payment: "Visa ·••• 4242",
  },
  {
    id: "ord_04",
    name: "Arcadia Retail Group",
    date: "2026-03-24",
    status: "canceled",
    payment: "Mastercard ·••• 8891",
  },
  {
    id: "ord_05",
    name: "Velvet Supply House",
    date: "2026-03-22",
    status: "paid",
    payment: "Wire transfer",
  },
];

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`${pillBase} ${statusStyles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

type RowMenuProps = {
  orderId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function RowActionsMenu({ orderId, onEdit, onDelete }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const measure = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 168;
    setCoords({
      top: r.bottom + 6,
      left: r.right - width,
    });
  }, []);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    measure();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => measure();
    const onResize = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const portal = typeof window !== "undefined"
    ? createPortal(
      <>
        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-[60] cursor-default bg-transparent"
            aria-label="Dismiss menu"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={menuRef}
              key={`menu-${orderId}`}
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
              className="panel-base fixed z-[70] min-w-[168px] overflow-hidden rounded-xl bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
              style={{ top: coords.top, left: coords.left }}
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ui-strong transition-colors hover:bg-white/50"
                onClick={() => {
                  setOpen(false);
                  onEdit?.(orderId);
                }}
              >
                Edit
              </button>
              <div className="mx-2 h-px bg-black/[0.06]" />
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-red-700 transition-colors hover:bg-red-500/[0.06]"
                onClick={() => {
                  setOpen(false);
                  onDelete?.(orderId);
                }}
              >
                Delete
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </>,
      document.body,
    )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#4B5563] transition-colors hover:bg-white/50 hover:text-[#0A0A0A]"
        aria-label="Order actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
      </button>
      {portal}
    </>
  );
}

export default function OrdersGrid({
  projectId,
  orders = MOCK_ORDERS,
  onCreateOrder,
  onEdit,
  onDelete,
}: OrdersGridProps) {
  const storageKey = projectId
    ? `quantum:project-orders:v1:${projectId}`
    : null;
  const [rows, setRows] = useState<OrderRow[]>(() => {
    if (!storageKey || typeof window === "undefined") return orders;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return orders;
      const parsed = JSON.parse(raw) as OrderRow[];
      return Array.isArray(parsed) ? parsed : orders;
    } catch {
      return orders;
    }
  });
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(rows));
  }, [rows, storageKey]);

  const handleCreate = (order: OrderRow) => {
    setRows((prev) => [order, ...prev]);
    onCreateOrder?.(order);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <OrderCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="btn-ui btn-ui-primary px-5 text-sm shadow-sm transition-[box-shadow,transform] active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
          Add Order
        </button>
      </div>

      <div className="panel-base glass-slab overflow-hidden rounded-2xl shadow-[20px_0_50px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.03]">
                <th className={headerCell}>Name</th>
                <th className={headerCell}>Date</th>
                <th className={headerCell}>Status</th>
                <th className={headerCell}>Payment</th>
                <th className={`${headerCell} w-14 pr-4 text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="antigravity-lift group relative z-0 border-b border-black/[0.04] transition-colors last:border-b-0 hover:z-10 hover:bg-white/40"
                >
                  <td className="px-4 py-3.5 text-sm font-medium text-ui-strong">
                    {row.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-ui-muted">
                    {row.date}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-ui-strong">
                    {row.payment}
                  </td>
                  <td className="px-4 py-3.5 text-right align-middle">
                    <RowActionsMenu
                      orderId={row.id}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
