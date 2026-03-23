"use client";

import Link from "next/link";
import type { FAQ } from "@/lib/faq/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function FAQRow({ faq }: { faq: FAQ }) {
  return (
    <Link
      href={`/dashboard/faq/${faq.id}`}
      className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 text-sm transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[minmax(0,2fr)_auto_auto]"
    >
      <span className="truncate font-light tracking-widest text-[#0a0a0a]">{faq.title}</span>
      <span
        className={
          faq.status === "published"
            ? "text-[10px] font-light uppercase tracking-widest text-[#0a0a0a]"
            : "text-[10px] font-light uppercase tracking-widest text-[#6b6b6b]"
        }
      >
        {faq.status}
      </span>
      <span className="text-[10px] font-light tracking-widest text-[#6b6b6b]">{formatDate(faq.createdAt)}</span>
    </Link>
  );
}
