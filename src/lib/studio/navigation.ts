export type StudioNavId =
  | "dashboard"
  | "faq"
  | "analytics"
  | "templates"
  | "orders";

export const STUDIO_NAV: {
  id: StudioNavId;
  href: string;
  label: string;
}[] = [
  { id: "faq", href: "/studio/faq", label: "FAQ" },
  { id: "analytics", href: "/studio/analytics", label: "Analytics" },
  { id: "templates", href: "/studio/templates", label: "Templates" },
  { id: "orders", href: "/studio/orders", label: "Orders" },
];

/** Nav items scoped to a project (sidebar under /project/[id]). */
export function getProjectStudioNav(projectId: string): {
  id: StudioNavId;
  href: string;
  label: string;
}[] {
  const base = `/project/${projectId}`;
  return [
    { id: "dashboard", href: `${base}/dashboard`, label: "Dashboard" },
    { id: "faq", href: `${base}/faq`, label: "FAQ" },
    { id: "analytics", href: `${base}/analytics`, label: "Analytics" },
    { id: "templates", href: `${base}/templates`, label: "Templates" },
    { id: "orders", href: `${base}/orders`, label: "Orders" },
  ];
}

export function parseProjectIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const m = pathname.match(/^\/project\/([^/]+)/);
  return m?.[1] ?? null;
}

export type StudioPageMeta = {
  title: string;
  breadcrumbs: string[];
};

/** Title + breadcrumbs per route. */
export function getStudioPageMeta(
  pathname: string | null,
  projectName?: string | null,
): StudioPageMeta {
  const segment = (() => {
    if (!pathname) return "";
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "project" && parts.length >= 3) return parts[2] ?? "";
    return "";
  })();

  const proj = projectName?.trim() || "Project";

  const sectionTitle = (() => {
    switch (segment) {
      case "dashboard":
        return "Dashboard";
      case "faq":
        return "FAQs";
      case "analytics":
        return "Analytics";
      case "templates":
        return "Templates";
      case "orders":
        return "Orders";
      default:
        return "Studio";
    }
  })();

  if (pathname?.startsWith("/project/")) {
    return {
      title: sectionTitle,
      breadcrumbs: [proj, sectionTitle],
    };
  }

  if (!pathname) {
    return { title: "Studio", breadcrumbs: ["Projects"] };
  }
  if (pathname === "/studio" || pathname === "/studio/") {
    return { title: "Projects", breadcrumbs: ["Projects"] };
  }
  if (pathname.startsWith("/studio/faq")) {
    return { title: "FAQs", breadcrumbs: ["Dashboard", "FAQ"] };
  }
  if (pathname.startsWith("/studio/analytics")) {
    return { title: "Analytics", breadcrumbs: ["Dashboard", "Analytics"] };
  }
  if (pathname.startsWith("/studio/templates")) {
    return { title: "Templates", breadcrumbs: ["Dashboard", "Templates"] };
  }
  if (pathname.startsWith("/studio/orders")) {
    return { title: "Orders", breadcrumbs: ["Dashboard", "Orders"] };
  }
  return { title: "Studio", breadcrumbs: ["Projects"] };
}
