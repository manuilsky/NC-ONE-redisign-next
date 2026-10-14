"use client";

import { useEffect } from "react";
import { isHomePath, scrollPageToTop } from "@/lib/home-scroll";

const RETRY_MS = [0, 80, 200, 500, 1000];

/**
 * The homepage must always open at the top, including after reload and when a
 * mobile browser restores a previous scroll offset. Anchor links still scroll.
 */
export function HomeScrollReset() {
  useEffect(() => {
    if (!isHomePath()) return;

    history.scrollRestoration = "manual";

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };

    const snap = () => {
      if (cancelled || window.location.hash || !isHomePath()) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        active.blur();
      }
      scrollPageToTop();
    };

    snap();
    const frame = requestAnimationFrame(snap);
    const timers = RETRY_MS.map((ms) => window.setTimeout(snap, ms));
    window.addEventListener("load", snap);

    for (const type of ["wheel", "touchstart", "pointerdown", "keydown"] as const) {
      window.addEventListener(type, cancel, { passive: true });
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !isHomePath()) return;
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
      cancelled = false;
      snap();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", snap);
      window.removeEventListener("pageshow", onPageShow);
      for (const type of ["wheel", "touchstart", "pointerdown", "keydown"] as const) {
        window.removeEventListener(type, cancel);
      }
      history.scrollRestoration = "auto";
    };
  }, []);

  return null;
}
