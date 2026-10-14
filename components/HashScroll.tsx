"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isDocumentReload, isHomePath } from "@/lib/home-scroll";

function scrollToHash(behavior: ScrollBehavior = "smooth") {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior, block: "start" });
  });
}

function clearHash() {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
}

// True only for the document that was actually reloaded, not later client navigations.
let initialHomeReloadHandled = false;

function shouldDropHashAfterReload() {
  if (initialHomeReloadHandled) return false;
  initialHomeReloadHandled = true;
  return isDocumentReload() && isHomePath();
}

/** Scrolls to `#hash` after route changes and on direct hash URLs. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (shouldDropHashAfterReload()) {
      if (window.location.hash) clearHash();
    } else {
      scrollToHash(window.location.hash ? "smooth" : "auto");
    }

    const onHashChange = () => scrollToHash("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
