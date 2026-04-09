"use client";

const FAQ_PROJECT_MAP_KEY = "quantum:project-faq-map:v1";
const PROJECT_TEMPLATE_KEY_PREFIX = "quantum:project-template:v1:";

type ProjectFaqMap = Record<string, string[]>;
export type ProjectThemeId = "minimalist" | "branded" | "quantum";

function readFaqProjectMap(): ProjectFaqMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(FAQ_PROJECT_MAP_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as ProjectFaqMap;
  } catch {
    return {};
  }
}

function writeFaqProjectMap(map: ProjectFaqMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAQ_PROJECT_MAP_KEY, JSON.stringify(map));
}

export function getFaqIdsForProject(projectId: string): string[] {
  if (!projectId) return [];
  const map = readFaqProjectMap();
  return map[projectId] ?? [];
}

export function assignFaqToProject(projectId: string, faqId: string): void {
  if (!projectId || !faqId) return;
  const map = readFaqProjectMap();
  const ids = new Set(map[projectId] ?? []);
  ids.add(faqId);
  map[projectId] = [...ids];
  writeFaqProjectMap(map);
}

export function getProjectTheme(projectId: string): ProjectThemeId | null {
  if (!projectId || typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(
    `${PROJECT_TEMPLATE_KEY_PREFIX}${projectId}`,
  );
  if (raw === "minimalist" || raw === "branded" || raw === "quantum") {
    return raw;
  }
  return null;
}

export function setProjectTheme(
  projectId: string,
  themeId: ProjectThemeId | null,
): void {
  if (!projectId || typeof window === "undefined") return;
  const key = `${PROJECT_TEMPLATE_KEY_PREFIX}${projectId}`;
  if (!themeId) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, themeId);
}

