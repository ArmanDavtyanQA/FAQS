import type { FAQ } from "@/lib/faq/types";
import FAQRow from "./FAQRow";

export default function FAQTable({ faqs }: { faqs: FAQ[] }) {
  if (faqs.length === 0) {
    return (
      <div className="rounded-[2rem] border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.01] px-6 py-12 text-center text-sm font-light tracking-widest text-[#6b6b6b] shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[30px]">
        No FAQs yet. Create your first one.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.01] shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[30px]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-3 text-[10px] font-light uppercase tracking-widest text-[#6b6b6b] shadow-sm md:grid-cols-[minmax(0,2fr)_auto_auto]">
        <span>Title</span>
        <span>Status</span>
        <span>Date</span>
      </div>
      <div className="divide-y divide-white/10 bg-transparent">
        {faqs.map((faq) => (
          <FAQRow key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
}
