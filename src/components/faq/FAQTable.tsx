"use client";

import { useMemo, useState } from "react";
import type { FAQ, Topic } from "@/lib/faq/types";
import FAQRow from "./FAQRow";

type Props = {
  faqs: FAQ[];
  topics: Topic[];
  projectId?: string;
};

export default function FAQTable({ faqs, topics, projectId }: Props) {
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
      <div className="panel-base rounded-2xl px-6 py-12 text-center text-sm text-ui-muted shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        No FAQs yet. Create your first one.
      </div>
    );
  }

  function TableHeader() {
    return (
      <div className="grid grid-cols-[1fr_minmax(0,1.2fr)_auto] gap-4 border-b border-[#e8e6e3] bg-transparent px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-ui-muted md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto]">
        <span>Title</span>
        <span>Topics</span>
        <span>Status</span>
      </div>
    );
  }

  function TableBody({ list }: { list: FAQ[] }) {
    return (
      <div className="divide-y divide-[#e8e6e3] bg-transparent">
        {list.map((faq) => (
          <FAQRow key={faq.id} faq={faq} projectId={projectId} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ui-muted">
          Topics
        </span>
        <button
          type="button"
          onClick={() => setTopicFilter("all")}
            className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] shadow-sm transition-all duration-300 ${
            topicFilter === "all"
              ? "border-[#0a0a0a] bg-surface text-[#0a0a0a] shadow-md shadow-black/[0.08] ring-2 ring-[#0a0a0a]/15"
              : "border-[#e8e6e3] bg-surface-muted/90 text-[#0a0a0a] hover:border-[#d6d3d1] hover:bg-surface"
          }`}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopicFilter(t.id)}
            className={`max-w-[min(100%,14rem)] truncate rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] shadow-sm transition-all duration-300 ${
              topicFilter === t.id
                ? "border-[#0a0a0a] bg-surface text-[#0a0a0a] shadow-md shadow-black/[0.08] ring-2 ring-[#0a0a0a]/15"
                : "border-[#e8e6e3] bg-surface-muted/90 text-[#0a0a0a] hover:border-[#d6d3d1] hover:bg-surface"
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
              <h3 className="label-caps mb-3 ml-1 text-ui-strong">
                {topic.title}
              </h3>
              <div className="panel-base overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                <TableHeader />
                <TableBody list={items} />
              </div>
            </section>
          ))}
          {grouped.uncategorized.length > 0 && (
            <section>
              <h3 className="label-caps mb-3 ml-1 text-ui-muted">
                Uncategorized
              </h3>
              <div className="panel-base overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
                <TableHeader />
                <TableBody list={grouped.uncategorized} />
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="panel-base overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <TableHeader />
          {filteredFaqs.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#4A4A4A]">
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
