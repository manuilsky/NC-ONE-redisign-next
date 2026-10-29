"use client";

import Link from "next/link";
import { IconArrowUpRight } from "@/components/CaseIcons";
import { ScrambleText } from "@/components/ScrambleText";
import type { Project } from "@/data/projects";
import { stripProjectLinks } from "@/data/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const MAX_VISIBLE_TAGS = 4;

function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);
  const extraTags = project.tags.length - visibleTags.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={styles.row}
      aria-label={`${project.title}. Открыть кейс`}
    >
      <div className={styles.inner}>
        <span className={styles.index}>{padIndex(index)}</span>
        <ScrambleText as="h3" className={styles.title} text={project.title} />
        <IconArrowUpRight className={styles.arrow} />
      </div>
      <div className={styles.meta}>
        <p className={styles.description}>
          {stripProjectLinks(project.desc)}
        </p>
        <div className={styles.tags}>
          {visibleTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {extraTags > 0 ? (
            <span className={styles.tagMore}>+{extraTags}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
