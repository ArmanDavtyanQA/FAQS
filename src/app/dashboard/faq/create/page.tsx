import { Suspense } from "react";
import CreateFaqPageClient from "./CreateFaqPageClient";
import DashboardSpinner from "@/components/DashboardSpinner";
import { isPaidPlan } from "@/lib/faq/plan";

export default function CreateFaqPage() {
  const paidPlan = isPaidPlan();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <DashboardSpinner label="Loading…" />
        </div>
      }
    >
      <CreateFaqPageClient paidPlan={paidPlan} />
    </Suspense>
  );
}
