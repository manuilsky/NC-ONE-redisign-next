"use client";

import { useEffect, useRef, useState } from "react";
import type { WhyUsItem } from "@/data/home";
import { whyUsIntro } from "@/data/home";
import styles from "./WhyUsSection.module.css";

type WhyUsSectionProps = {
  items: WhyUsItem[];
};

export function WhyUsSection({ items }: WhyUsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const parent = track.parentElement;
      if (!parent) return;
      const distance = Math.max(0, track.scrollWidth - parent.clientWidth);
      setScrollDistance(distance);
      if (distance <= 0) {
        track.style.transform = "translate3d(0,0,0)";
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    if (track.parentElement) ro.observe(track.parentElement);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      if (scrollDistance <= 0) {
        track.style.transform = "translate3d(0,0,0)";
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const scrolled = Math.min(
        Math.max(-sectionTop + stickyTop, 0),
        scrollDistance,
      );
      track.style.transform = `translate3d(${-scrolled}px, 0, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollDistance]);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className={styles.section}
      style={
        scrollDistance > 0
          ? {
              height: `calc(100vh - var(--header-h) + ${scrollDistance}px)`,
            }
          : undefined
      }
    >
      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.inner}>
          <header className={styles.head}>
            <p className={styles.label}>{whyUsIntro.label}</p>
            <h2 className={styles.title}>
              {whyUsIntro.titleBefore}
              <span className="textAccent">{whyUsIntro.titleAccent}</span>
            </h2>
          </header>

          <div
            className={styles.viewport}
            role="region"
            aria-label="Преимущества"
          >
            <div ref={trackRef} className={styles.track}>
              {items.map((item) => (
                <article key={item.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <p className={styles.cardNumber}>{item.number}</p>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardText}>{item.text}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.footerLabel}>{item.footerLabel}</span>
                    <span className={styles.footerHighlight}>
                      {item.footerHighlight}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
