"use client";

import { useParams } from "next/navigation";
import AnalyticsView from "@/components/analytics/AnalyticsView";

export default function ProjectAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  return <AnalyticsView projectId={id} />;
}
