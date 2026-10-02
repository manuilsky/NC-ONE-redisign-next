"use client";

import { useState } from "react";
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
  const visible = filterProjectsByCategory(activeCategory, projects);

  return (
    <>
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
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className={styles.grid}>
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>В этой категории пока нет проектов.</p>
      )}
    </>
  );
}
