"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(behavior: ScrollBehavior = "smooth") {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior, block: "start" });
  });
}

/** Scrolls to `#hash` after route changes and on direct hash URLs. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToHash(window.location.hash ? "smooth" : "auto");

    const onHashChange = () => scrollToHash("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
