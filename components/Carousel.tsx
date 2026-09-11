"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Carousel.module.css";

type CarouselProps = {
  children: ReactNode[];
  ariaLabel: string;
  className?: string;
};

export function Carousel({ children, ariaLabel, className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = children.length;

  const scrollToIndex = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = ((next % count) + count) % count;
    const child = track.children[clamped] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setIndex(clamped);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const childrenEls = Array.from(track.children) as HTMLElement[];
      if (!childrenEls.length) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      childrenEls.forEach((el, i) => {
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <div
        ref={trackRef}
        className={styles.track}
        role="region"
        aria-roledescription="карусель"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollToIndex(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollToIndex(index - 1);
          }
        }}
      >
        {children.map((child, i) => (
          <div key={i} className={styles.slide}>
            {child}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Предыдущий слайд"
          onClick={() => scrollToIndex(index - 1)}
        >
          ←
        </button>
        <div className={styles.dots} role="tablist" aria-label="Слайды">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Слайд ${i + 1}`}
              className={i === index ? styles.dotActive : styles.dot}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Следующий слайд"
          onClick={() => scrollToIndex(index + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
