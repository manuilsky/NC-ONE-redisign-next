"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import styles from "./Reveal.module.css";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: "sm" | "md" | "lg";
  rootMargin?: string;
  style?: CSSProperties;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  distance = "md",
  rootMargin = "0px 0px -12% 0px",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.classList.add(styles.visible);
      const done = (event: TransitionEvent) => {
        if (event.propertyName !== "transform") return;
        el.style.willChange = "auto";
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      el.style.willChange = "auto";
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        io.disconnect();
      },
      { threshold: 0.08, rootMargin },
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [rootMargin]);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, styles[distance], className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ...style,
          "--reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
