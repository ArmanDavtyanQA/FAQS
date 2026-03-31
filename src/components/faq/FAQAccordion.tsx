"use client";

import { useEffect, useMemo, useState } from "react";
import type { FAQ } from "@/lib/faq/types";
import RichText from "@/components/RichText";

/** Group / section labels — charcoal, readable on cream */
const faqLabelClass =
  "mb-5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-[#4B5563]";

function topicOptionsFromFaqs(faqs: FAQ[]) {
  const map = new Map<string, string>();
  for (const faq of faqs) {
    if (faq.topicLabels?.length) {
      for (const t of faq.topicLabels) {
        map.set(t.id, t.title);
      }
    }
  }
  return [...map.entries()]
    .map(([id, title]) => ({ id, title }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const topicOptions = useMemo(() => topicOptionsFromFaqs(faqs), [faqs]);

  useEffect(() => {
    if (
      topicFilter !== "all" &&
      !topicOptions.some((t) => t.id === topicFilter)
    ) {
      setTopicFilter("all");
    }
  }, [topicFilter, topicOptions]);

  const visibleFaqs = useMemo(() => {
    if (topicFilter === "all") return faqs;
    return faqs.filter((f) => f.topicIds.includes(topicFilter));
  }, [faqs, topicFilter]);

  const grouped = useMemo(() => {
    if (topicFilter !== "all") return null;
    const opts = topicOptions;
    const groups: { id: string; title: string; items: FAQ[] }[] = [];
    for (const t of opts) {
      const items = faqs.filter((f) => f.topicIds.includes(t.id));
      if (items.length) groups.push({ id: t.id, title: t.title, items });
    }
    const uncategorized = faqs.filter((f) => f.topicIds.length === 0);
    return { groups, uncategorized };
  }, [faqs, topicFilter, topicOptions]);

  if (faqs.length === 0) return null;

  const pillBase =
    "rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all duration-300";
  const pillInactive = `${pillBase} border-yellow-600/30 bg-white/20 text-[#4B5563] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.05)] backdrop-blur-md hover:border-yellow-600/45 hover:bg-white/35`;
  const pillActive = `${pillBase} border-yellow-600/50 bg-white/45 text-[#0A0A0A] shadow-[0_12px_40px_-14px_rgba(234,179,8,0.12)] backdrop-blur-md`;

  function renderList(list: FAQ[]) {
    return (
      <div className="flex flex-col gap-3">
        {list.map((faq) => {
          const isOpen = openId === faq.id;
          const topicLine =
            faq.topicLabels?.map((t) => t.title).join(" · ") ?? "";
          return (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-xl border border-t-white/60 border-b-black/[0.07] border-r-black/[0.07] bg-white/15 shadow-[0_20px_56px_-18px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all duration-300 antigravity-lift hover:bg-white/30 hover:border-l-yellow-500/45 ${
                isOpen
                  ? "border-l-yellow-500/50 bg-white/25 shadow-[0_28px_72px_-20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
                  : "border-l-white/50"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6"
              >
                <span className="min-w-0 flex-1 text-pretty text-sm font-medium leading-snug text-[#1F1F1F] sm:text-base">
                  {faq.title}
                </span>
                <span
                  className="mt-0.5 shrink-0 text-lg font-medium tabular-nums leading-none text-amber-600"
                  aria-hidden
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="bg-yellow-100/30">
                  {topicLine.length > 0 && (
                    <div className="border-t border-black/[0.06] px-5 py-2 sm:px-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6B7280]">
                        {topicLine}
                      </p>
                    </div>
                  )}
                  <div
                    className={`px-5 py-4 sm:px-6 sm:py-5 ${
                      topicLine.length > 0 ? "border-t border-black/[0.05]" : "border-t border-black/[0.06]"
                    }`}
                  >
                    <div>
                      {faq.answers.map((answer, i) => (
                        <div key={i}>
                          {i > 0 && (
                            <div
                              className="my-5 h-px w-full bg-black/[0.08]"
                              role="separator"
                              aria-hidden
                            />
                          )}
                          <RichText
                            html={answer}
                            className="text-sm leading-relaxed text-[#6B7280]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {topicOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#4B5563]">
            Topics
          </span>
          <button
            type="button"
            onClick={() => setTopicFilter("all")}
            className={topicFilter === "all" ? pillActive : pillInactive}
          >
            All
          </button>
          {topicOptions.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopicFilter(t.id)}
              className={topicFilter === t.id ? pillActive : pillInactive}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      {topicFilter === "all" && grouped && topicOptions.length > 0 ? (
        <div className="space-y-12">
          {grouped.groups.map((g) => (
            <section key={g.id}>
              <p className={faqLabelClass}>{g.title}</p>
              {renderList(g.items)}
            </section>
          ))}
          {grouped.uncategorized.length > 0 && (
            <section>
              <p className={faqLabelClass}>Other</p>
              {renderList(grouped.uncategorized)}
            </section>
          )}
        </div>
      ) : visibleFaqs.length === 0 ? (
        <p className="text-sm text-[#6B7280]">No questions in this topic.</p>
      ) : (
        renderList(visibleFaqs)
      )}
    </div>
  );
}
