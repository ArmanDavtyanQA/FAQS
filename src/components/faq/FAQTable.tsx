"use client";

import { useMemo, useState } from "react";
import type { FAQ, Topic } from "@/lib/faq/types";
import FAQRow from "./FAQRow";

type Props = {
  faqs: FAQ[];
  topics: Topic[];
};

export default function FAQTable({ faqs, topics }: Props) {
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const filteredFaqs = useMemo(() => {
    if (topicFilter === "all") return faqs;
    return faqs.filter((f) => f.topicIds.includes(topicFilter));
  }, [faqs, topicFilter]);

  const grouped = useMemo(() => {
    if (topicFilter !== "all") return null;
    const groups: { topic: Topic; items: FAQ[] }[] = [];
    for (const topic of topics) {
      const items = faqs.filter((f) => f.topicIds.includes(topic.id));
      if (items.length) groups.push({ topic, items });
    }
    const uncategorized = faqs.filter((f) => f.topicIds.length === 0);
    return { groups, uncategorized };
  }, [faqs, topics, topicFilter]);

  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e8e6e3] bg-white px-6 py-12 text-center text-sm text-[#6b6b6b] shadow-xl shadow-black/5">
        No FAQs yet. Create your first one.
      </div>
    );
  }

  function TableHeader() {
    return (
      <div className="grid grid-cols-[1fr_minmax(0,1.2fr)_auto] gap-4 border-b border-[#e8e6e3] bg-[#fafaf9] px-4 py-3 text-[10px] font-medium uppercase tracking-widest text-[#6b6b6b] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto]">
        <span>Title</span>
        <span>Topics</span>
        <span>Status</span>
      </div>
    );
  }

  function TableBody({ list }: { list: FAQ[] }) {
    return (
      <div className="divide-y divide-[#e8e6e3] bg-white">
        {list.map((faq) => (
          <FAQRow key={faq.id} faq={faq} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b6b6b]">
          Filter
        </span>
        <button
          type="button"
          onClick={() => setTopicFilter("all")}
          className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest transition-colors ${
            topicFilter === "all"
              ? "border-[#0a0a0a] bg-[#f5f5f4] text-[#0a0a0a]"
              : "border-[#e8e6e3] text-[#6b6b6b] hover:border-[#d6d3d1]"
          }`}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopicFilter(t.id)}
            className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest transition-colors ${
              topicFilter === t.id
                ? "border-[#0a0a0a] bg-[#f5f5f4] text-[#0a0a0a]"
                : "border-[#e8e6e3] text-[#6b6b6b] hover:border-[#d6d3d1]"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {topicFilter === "all" && grouped ? (
        <div className="space-y-10">
          {grouped.groups.map(({ topic, items }) => (
            <section key={topic.id}>
              <h3 className="label-caps mb-3 ml-1 text-[#0a0a0a]">
                {topic.title}
              </h3>
              <div className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-white shadow-xl shadow-black/5">
                <TableHeader />
                <TableBody list={items} />
              </div>
            </section>
          ))}
          {grouped.uncategorized.length > 0 && (
            <section>
              <h3 className="label-caps mb-3 ml-1 text-[#6b6b6b]">
                Uncategorized
              </h3>
              <div className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-white shadow-xl shadow-black/5">
                <TableHeader />
                <TableBody list={grouped.uncategorized} />
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-white shadow-xl shadow-black/5">
          <TableHeader />
          {filteredFaqs.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#6b6b6b]">
              No questions in this topic.
            </div>
          ) : (
            <TableBody list={filteredFaqs} />
          )}
        </div>
      )}
    </div>
  );
}
