import Link from "next/link";
import FAQForm from "@/components/faq/FAQForm";
import { isPaidPlan } from "@/lib/faq/plan";

export default function CreateFaqPage() {
  const paidPlan = isPaidPlan();

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="text-[11px] font-medium uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0a0a0a]">
          Create FAQ
        </h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          {paidPlan
            ? "Templates or AI can prefill the form."
            : "Enter question and answers manually."}
        </p>
      </div>
      <FAQForm paidPlan={paidPlan} />
    </main>
  );
}
