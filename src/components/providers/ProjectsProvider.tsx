"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Project } from "@/lib/projects/types";

const STORAGE_KEY = "quantum-studio-projects-v1";

const seedProjects = (): Project[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "proj_test_alpha",
      name: "Test Project Alpha",
      domain: "alpha.example.com",
      description: "Sample workspace for FAQ and analytics (test).",
      updatedAt: now,
    },
    {
      id: "proj_test_beta",
      name: "Test Project Beta",
      domain: "beta.example.com",
      description: "Second sample workspace for Studio navigation (test).",
      updatedAt: now,
    },
  ];
};

type ProjectsContextValue = {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  addProject: (input: Omit<Project, "id" | "updatedAt">) => Project;
  updateProject: (id: string, patch: Partial<Omit<Project, "id">>) => void;
  removeProject: (id: string) => void;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function loadFromStorage(): Project[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => seedProjects());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setProjects(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects, hydrated]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  const addProject = useCallback(
    (input: Omit<Project, "id" | "updatedAt">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `proj_${crypto.randomUUID()}`
          : `proj_${Date.now()}`;
      const next: Project = {
        ...input,
        id,
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Omit<Project, "id">>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
    },
    [],
  );

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      projects,
      getProject,
      addProject,
      updateProject,
      removeProject,
    }),
    [projects, getProject, addProject, updateProject, removeProject],
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return ctx;
}

/** Resolve a single project by id (e.g. from `/project/[id]/…`). */
export function useProject(id: string | null | undefined): Project | undefined {
  const { getProject } = useProjects();
  if (!id) return undefined;
  return getProject(id);
}
