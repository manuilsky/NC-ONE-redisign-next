import Link from "next/link";
import type { Project } from "@/data/projects";
import { getProjectCategoryLabels } from "@/data/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const categories = getProjectCategoryLabels(project);

  return (
    <article className={styles.card}>
      <p className={styles.meta}>{categories.join(" · ")}</p>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.desc}</p>
      <div className={styles.tags}>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className={styles.link}>
        Смотреть проект →
      </Link>
    </article>
  );
}
