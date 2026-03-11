"use client";

import type { FAQGenerateItem } from "@/lib/faq/types";

type Props = {
  templates: { category: string; items: FAQGenerateItem[] }[];
  onSelect: (item: FAQGenerateItem) => void;
  disabled?: boolean;
};

export default function FAQSuggestions({
  templates,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a]">
        Suggested templates
      </h3>
      <p className="text-xs text-[#6b6b6b]">
        Click to prefill. Edit before saving.
      </p>
      <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
        {templates.map((group) => (
          <div key={group.category}>
            <p className="label-caps mb-2">
              {group.category}
            </p>
            <ul className="space-y-2">
              {group.items.map((item, i) => (
                <li key={`${group.category}-${i}`}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(item)}
                    className="btn-ghost-edge interactive-smooth w-full rounded-xl border border-transparent bg-[#f7f6f3] px-3 py-2 text-left text-xs text-[#0a0a0a] shadow-sm hover:bg-black/[0.04] hover:shadow-md disabled:opacity-50"
                  >
                    <span className="font-medium text-[#0a0a0a]">
                      {item.question}
                    </span>
                    {item.answers[0] && (
                      <p className="mt-1 line-clamp-2 text-[#6b6b6b]">
                        {item.answers[0]}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
