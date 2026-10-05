"use client";

import Link from "next/link";
import { IconArrowUpRight } from "@/components/CaseIcons";
import { ScrambleText } from "@/components/ScrambleText";
import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  index: number;
};

function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function ProjectCard({ project, index }: ProjectCardProps) {
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
        <p className={styles.description}>{project.desc}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
