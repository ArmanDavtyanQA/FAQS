import type { FAQ } from "@/lib/faq/types";
import FAQRow from "./FAQRow";

export default function FAQTable({ faqs }: { faqs: FAQ[] }) {
  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e8e6e3] bg-white px-6 py-12 text-center text-sm text-[#6b6b6b] shadow-lg shadow-black/5">
        No FAQs yet. Create your first one.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-white shadow-xl shadow-black/5">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#e8e6e3] bg-[#fafaf9] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] shadow-sm md:grid-cols-[minmax(0,2fr)_auto_auto]">
        <span>Title</span>
        <span>Status</span>
        <span>Date</span>
      </div>
      <div className="divide-y divide-[#e8e6e3] bg-white">
        {faqs.map((faq) => (
          <FAQRow key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
}
