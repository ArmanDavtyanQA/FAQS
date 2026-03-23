"use client";

import Link from "next/link";
import type { FAQ } from "@/lib/faq/types";

function topicDisplayText(faq: FAQ): string {
  if (faq.topicLabels?.length) {
    return faq.topicLabels.map((t) => t.title).join(", ");
  }
  if (faq.topicIds.length === 0) return "—";
  return faq.topicIds.length === 1
    ? "1 topic"
    : `${faq.topicIds.length} topics`;
}

export default function FAQRow({ faq }: { faq: FAQ }) {
  return (
    <Link
      href={`/dashboard/faq/${faq.id}`}
      className="grid grid-cols-[1fr_minmax(0,1.2fr)_auto] gap-4 px-4 py-3 text-sm transition-colors duration-300 hover:bg-[#fafaf9] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto]"
    >
      <span className="truncate font-light tracking-widest text-[#0a0a0a]">
        {faq.title}
      </span>
      <span
        className="truncate text-[10px] font-light tracking-widest text-[#6b6b6b]"
        title={topicDisplayText(faq)}
      >
        {topicDisplayText(faq)}
      </span>
      <span
        className={
          faq.status === "published"
            ? "text-[10px] font-light uppercase tracking-widest text-[#0a0a0a]"
            : "text-[10px] font-light uppercase tracking-widest text-[#6b6b6b]"
        }
      >
        {faq.status}
      </span>
    </Link>
  );
}
