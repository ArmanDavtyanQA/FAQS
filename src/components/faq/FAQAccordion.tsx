"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/faq/types";

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  if (faqs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-white shadow-xl shadow-black/5">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="border-b border-[#e8e6e3] last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="hover-soft-gray flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:shadow-inner"
            >
              <span className="text-sm font-medium text-[#0a0a0a]">
                {faq.title}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-[#e8e6e3] bg-[#fafaf9] px-5 py-4 shadow-inner">
                <div className="space-y-4 text-sm leading-relaxed text-[#6b6b6b]">
                  {faq.answers.map((answer, i) => (
                    <p key={i}>{answer}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
