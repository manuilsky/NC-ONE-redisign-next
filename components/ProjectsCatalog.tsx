"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
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
  const visible = filterProjectsByCategory(activeCategory, projects);

  const selectCategory = (slug: string) => {
    if (slug === activeCategory) return;
    setActiveCategory(slug);
    setAnimKey((key) => key + 1);
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
          <div className={styles.list}>
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
