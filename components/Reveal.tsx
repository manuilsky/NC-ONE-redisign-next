"use client";

import {
  useEffect,
  useRef,
  useState,
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const show = () => {
      setVisible(true);
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
  }, [rootMargin, visible]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !visible) return;

    const done = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      el.style.willChange = "auto";
    };

    el.addEventListener("transitionend", done);
    return () => el.removeEventListener("transitionend", done);
  }, [visible]);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, styles[distance], visible && styles.visible, className]
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
