"use client";

import { ProjectsProvider } from "@/components/providers/ProjectsProvider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectsProvider>{children}</ProjectsProvider>;
}
