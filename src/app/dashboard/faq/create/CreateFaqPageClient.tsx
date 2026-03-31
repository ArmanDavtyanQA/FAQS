"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardAreaHeader from "@/components/DashboardAreaHeader";
import FAQForm from "@/components/faq/FAQForm";

export default function CreateFaqPageClient({ paidPlan }: { paidPlan: boolean }) {
  const searchParams = useSearchParams();
  const initialTopicId = searchParams.get("topic");

  return (
    <div className="-mx-4 min-h-[calc(100dvh-6rem)] bg-transparent text-[#0a0a0a] sm:-mx-6 lg:-mx-10">
      <DashboardAreaHeader>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0a0a0a]">
          Create
        </span>
        <Link
          href="/dashboard"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Dashboard
        </Link>
      </DashboardAreaHeader>

      <main className="mx-auto max-w-5xl px-5 py-14">
        <p className="label-caps mb-4">Editor</p>
        <h1 className="text-3xl font-normal tracking-tight text-[#0a0a0a]">
          Create FAQ
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
          {paidPlan
            ? "Templates or AI can prefill the form."
            : "Enter question and answers manually."}
        </p>
        <div className="mt-10">
          <FAQForm
            paidPlan={paidPlan}
            initialTopicId={initialTopicId || null}
          />
        </div>
      </main>
    </div>
  );
}
