"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Returns the current pathname and a matcher for active nav routes.
 * Prefix match by default so nested routes stay highlighted.
 */
export function useActivePath() {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string, options?: { exact?: boolean }) => {
      if (!pathname) return false;
      const exact = options?.exact ?? false;
      if (exact) return pathname === href;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return { pathname, isActive };
}
