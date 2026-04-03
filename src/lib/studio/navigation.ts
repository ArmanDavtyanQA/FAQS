export type StudioNavId = "faq" | "analytics" | "templates" | "orders";

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

export type StudioPageMeta = {
  title: string;
  breadcrumbs: string[];
};

/** Title + breadcrumbs per route (extend when adding nested studio routes). */
export function getStudioPageMeta(pathname: string | null): StudioPageMeta {
  if (!pathname) {
    return { title: "Studio", breadcrumbs: ["Dashboard"] };
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
  return { title: "Studio", breadcrumbs: ["Dashboard"] };
}
