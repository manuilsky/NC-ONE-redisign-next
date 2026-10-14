/** Homepage path with or without `basePath` (`usePathname` omits it, `location` includes it). */
export function isHomePath(pathname?: string) {
  const raw =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const path = raw.replace(/\/+$/, "") || "/";
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  if (!base) return path === "/";
  return path === "/" || path === base;
}

export function isDocumentReload() {
  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return entry?.type === "reload";
}

/** Instant jump to the top. Does not leave attributes on `<html>` (hydration). */
export function scrollPageToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
