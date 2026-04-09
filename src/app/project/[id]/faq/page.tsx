"use client";

import { useParams } from "next/navigation";
import DashboardFaqSection from "@/components/faq/DashboardFaqSection";

export default function ProjectFaqPage() {
  const { id } = useParams<{ id: string }>();
  return <DashboardFaqSection projectId={id} />;
}
