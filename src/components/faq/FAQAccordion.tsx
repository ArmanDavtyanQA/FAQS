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

  const answerOnDarkClass =
    "space-y-4 text-sm leading-relaxed [&_p]:text-neutral-300 [&_li]:text-neutral-300 [&_ul]:my-2 [&_ol]:my-2 [&_a]:text-white [&_a]:underline [&_strong]:text-white [&_em]:text-neutral-200 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:text-neutral-200";

  function renderList(list: FAQ[]) {
    return (
      <div className="flex flex-col gap-5">
        {list.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-2xl border transition-[background-color,box-shadow,border-color] duration-300 ${
                isOpen
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-md shadow-black/25"
                  : "border-[#e8e6e3] bg-white shadow-sm shadow-black/[0.07]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={`flex w-full items-start justify-between gap-6 px-6 py-7 text-left sm:px-8 sm:py-8 ${
                  isOpen
                    ? "hover:bg-white/[0.04]"
                    : "hover:bg-[#fafaf9]/80"
                } transition-colors`}
              >
                <span
                  className={`min-w-0 flex-1 text-pretty text-lg font-medium leading-snug tracking-tight sm:text-xl ${
                    isOpen ? "text-white" : "text-[#0a0a0a]"
                  }`}
                >
                  {faq.title}
                </span>
                <span
                  className={`mt-0.5 shrink-0 text-xl font-light tabular-nums leading-none sm:text-2xl ${
                    isOpen ? "text-white/70" : "text-[#6b6b6b]"
                  }`}
                  aria-hidden
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-white/15 px-6 pb-8 pt-2 sm:px-8 sm:pb-10">
                  <div className={answerOnDarkClass}>
                    {faq.answers.map((answer, i) => (
                      <RichText key={i} html={answer} />
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
