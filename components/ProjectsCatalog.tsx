"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import {
  filterProjectsByCategory,
  workCategories,
  type Project,
} from "@/data/projects";
import styles from "@/app/projects/page.module.css";

type ProjectsCatalogProps = {
  projects: Project[];
};

export function ProjectsCatalog({ projects }: ProjectsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [animKey, setAnimKey] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const visible = filterProjectsByCategory(activeCategory, projects);

  const selectCategory = (slug: string) => {
    if (slug === activeCategory) return;
    setActiveCategory(slug);
    setAnimKey((key) => key + 1);
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const syncRect = () => {
      rectRef.current = list.getBoundingClientRect();
    };

    syncRect();
    window.addEventListener("scroll", syncRect, { passive: true });
    window.addEventListener("resize", syncRect, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncRect);
      window.removeEventListener("resize", syncRect);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animKey, visible.length]);

  const flushGlow = () => {
    rafRef.current = 0;
    const glow = glowRef.current;
    const pending = pendingRef.current;
    if (!glow || !pending) return;
    glow.style.transform = `translate3d(${pending.x}px, ${pending.y}px, 0)`;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current;
    const glow = glowRef.current;
    if (!list || !glow) return;

    if (!rectRef.current) {
      rectRef.current = list.getBoundingClientRect();
    }

    const rect = rectRef.current;
    pendingRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    glow.dataset.active = "true";

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(flushGlow);
    }
  };

  const onPointerLeave = () => {
    const glow = glowRef.current;
    if (!glow) return;
    glow.dataset.active = "false";
    pendingRef.current = null;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  return (
    <div className={styles.catalog}>
      <div className={styles.filters} role="tablist" aria-label="Категории проектов">
        {workCategories.map((category) => {
          const isActive = category.slug === activeCategory;
          return (
            <button
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.filter} ${isActive ? styles.filterActive : ""}`}
              onClick={() => selectCategory(category.slug)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div key={animKey} className={styles.results}>
        {visible.length > 0 ? (
          <div
            ref={listRef}
            className={styles.list}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <span ref={glowRef} className={styles.spotlight} aria-hidden="true" />
            {visible.map((project, i) => (
              <div
                key={project.slug}
                className={styles.item}
                style={{ "--item-index": i } as CSSProperties}
              >
                <ProjectCard project={project} index={i + 1} />
              </div>
            ))}
          </div>
        ) : (
          <p className={`${styles.empty} ${styles.item}`}>
            В этой категории пока нет проектов.
          </p>
        )}

        <div
          className={`${styles.discussRow} ${styles.item}`}
          style={{ "--item-index": visible.length } as CSSProperties}
        >
          <Link href="#contact" className={`button buttonGhost ${styles.discuss}`}>
            Обсудить проект <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
