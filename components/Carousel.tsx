"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Carousel.module.css";

type CarouselProps = {
  children: ReactNode[];
  ariaLabel: string;
  className?: string;
};

function slideSpan(track: HTMLDivElement) {
  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length < 2) return slides[0]?.offsetWidth ?? 0;
  return slides[1].offsetLeft - slides[0].offsetLeft;
}

function metrics(track: HTMLDivElement, count: number) {
  const span = slideSpan(track);
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const hidden =
    span > 0 ? Math.min(Math.max(0, count - 1), Math.round(maxScroll / span)) : 0;
  const pageCount = hidden + 1;
  const index = span > 0 ? Math.round(track.scrollLeft / span) : 0;

  return {
    span,
    pageCount,
    index: Math.min(Math.max(0, index), pageCount - 1),
  };
}

export function Carousel({ children, ariaLabel, className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = children.length;
  const [index, setIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const syncFromTrack = () => {
    const track = trackRef.current;
    if (!track) return null;
    const next = metrics(track, count);
    setPageCount(next.pageCount);
    setIndex(next.index);
    return next;
  };

  const scrollToIndex = (next: number, wrap = false) => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    const { pageCount: pages, span } = metrics(track, count);
    const last = pages - 1;
    const clamped = wrap
      ? ((next % pages) + pages) % pages
      : Math.min(Math.max(0, next), last);
    track.scrollTo({ left: clamped * span, behavior: "smooth" });
    setIndex(clamped);
    setPageCount(pages);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      syncFromTrack();
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [count]);

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
            scrollToIndex(index + 1, true);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollToIndex(index - 1, true);
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
          onClick={() => scrollToIndex(index - 1, true)}
        >
          ←
        </button>
        <div className={styles.dots} role="tablist" aria-label="Слайды">
          {Array.from({ length: pageCount }, (_, i) => (
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
          onClick={() => scrollToIndex(index + 1, true)}
        >
          →
        </button>
      </div>
    </div>
  );
}
