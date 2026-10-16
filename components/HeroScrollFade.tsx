"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./HeroScrollFade.module.css";

type HeroScrollFadeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll-linked dissolve for the homepage hero: as the first block moves up,
 * its content gently fades and lifts — matching the reference recording.
 */
export function HeroScrollFade({ children, className }: HeroScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const section = el.closest("section") ?? el;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      // Distance the section has traveled above the viewport top.
      const traveled = Math.max(0, -rect.top);
      // Fully dissolved once ~half the hero has scrolled past — soft, early fade.
      const range = Math.max(rect.height * 0.5, 1);
      const t = Math.min(1, traveled / range);
      // Ease-in: stays readable at first, then dissolves (as in the reference).
      const eased = t * t;

      el.style.setProperty("--hero-fade", String(1 - eased));
      el.style.setProperty("--hero-lift", `${(-eased * 2.25).toFixed(3)}rem`);
      el.style.pointerEvents = eased > 0.88 ? "none" : "";
    };

    const requestApply = () => {
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", requestApply, { passive: true });
    window.addEventListener("resize", requestApply);
    window.visualViewport?.addEventListener("resize", requestApply);

    return () => {
      window.removeEventListener("scroll", requestApply);
      window.removeEventListener("resize", requestApply);
      window.visualViewport?.removeEventListener("resize", requestApply);
      if (raf) window.cancelAnimationFrame(raf);
      el.style.removeProperty("--hero-fade");
      el.style.removeProperty("--hero-lift");
      el.style.pointerEvents = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={
        {
          "--hero-fade": 1,
          "--hero-lift": "0rem",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
