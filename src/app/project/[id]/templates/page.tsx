"use client";

import TemplatesView from "@/components/templates/TemplatesView";
import { useParams } from "next/navigation";

/** Pro UX in project context (locks + Quantum Sync visible). */
export default function ProjectTemplatesPage() {
  const { id } = useParams<{ id: string }>();
  return <TemplatesView userPlan="pro" projectId={id} />;
}
