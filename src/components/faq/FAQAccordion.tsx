"use client";

import { useEffect, useMemo, useState } from "react";
import type { FAQ } from "@/lib/faq/types";
import RichText from "@/components/RichText";

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
              className={`overflow-hidden rounded-xl bg-white transition-[box-shadow,border-color] ${
                isOpen
                  ? "border-2 border-[#0a0a0a] shadow-md shadow-black/15 ring-1 ring-[#0a0a0a]/10"
                  : "border border-[#e8e6e3] shadow-sm shadow-black/[0.06]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={`flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6 ${
                  isOpen ? "bg-white" : "hover:bg-[#fafaf9]/90"
                }`}
              >
                <span className="min-w-0 flex-1 text-pretty text-sm font-medium leading-snug text-[#0a0a0a] sm:text-base">
                  {faq.title}
                </span>
                <span
                  className="mt-0.5 shrink-0 text-lg font-light tabular-nums leading-none text-[#6b6b6b]"
                  aria-hidden
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <>
                  {topicLine.length > 0 && (
                    <div className="border-t border-[#e8e6e3] bg-white px-5 py-2 sm:px-6">
                      <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">
                        {topicLine}
                      </p>
                    </div>
                  )}
                  <div className="border-t border-[#e8e6e3] bg-white px-5 py-4 sm:px-6 sm:py-5">
                    <div>
                      {faq.answers.map((answer, i) => (
                        <div key={i}>
                          {i > 0 && (
                            <div
                              className="my-5 h-px w-full bg-[#e8e6e3]"
                              role="separator"
                              aria-hidden
                            />
                          )}
                          <RichText
                            html={answer}
                            className="text-sm leading-relaxed text-[#6b6b6b]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b6b6b]">
            Topics
          </span>
          <button
            type="button"
            onClick={() => setTopicFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-colors ${
              topicFilter === "all"
                ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                : "border-[#e8e6e3] bg-white text-[#6b6b6b] shadow-sm shadow-black/[0.04] hover:border-[#d6d3d1]"
            }`}
          >
            All
          </button>
          {topicOptions.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopicFilter(t.id)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                topicFilter === t.id
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                  : "border-[#e8e6e3] bg-white text-[#6b6b6b] shadow-sm shadow-black/[0.04] hover:border-[#d6d3d1]"
              }`}
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
              <p className="label-caps mb-5 text-[#0a0a0a]">{g.title}</p>
              {renderList(g.items)}
            </section>
          ))}
          {grouped.uncategorized.length > 0 && (
            <section>
              <p className="label-caps mb-5 text-[#6b6b6b]">Other</p>
              {renderList(grouped.uncategorized)}
            </section>
          )}
        </div>
      ) : visibleFaqs.length === 0 ? (
        <p className="text-sm text-[#6b6b6b]">No questions in this topic.</p>
      ) : (
        renderList(visibleFaqs)
      )}
    </div>
  );
}
