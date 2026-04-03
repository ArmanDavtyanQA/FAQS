"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProjects } from "@/components/providers/ProjectsProvider";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { getProject } = useProjects();
  const project = getProject(id);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#4B5563]">
        Overview
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0A0A0A]">
        {project?.name ?? "Project"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
        {project?.domain
          ? `Domain · ${project.domain}`
          : "Manage FAQs, analytics, templates, and orders from the sidebar."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/project/${id}/faq`}
          className="rounded-2xl border border-black/[0.08] bg-white/50 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] shadow-sm backdrop-blur-sm transition hover:border-black/[0.12]"
        >
          Open FAQs
        </Link>
        <Link
          href={`/project/${id}/templates`}
          className="rounded-2xl border border-black/[0.08] bg-white/50 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] shadow-sm backdrop-blur-sm transition hover:border-black/[0.12]"
        >
          Templates
        </Link>
      </div>
    </div>
  );
}
