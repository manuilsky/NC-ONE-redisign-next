import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Портфолио реализованных проектов NC 1.",
};

export default function ProjectsPage() {
  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link href="/" className={styles.back}>
            ← На главную
          </Link>
          <p className={`sectionLabel ${styles.label}`}>[ портфолио ]</p>
          <h1 className={styles.title}>
            Все <span className="textAccent">проекты</span>
          </h1>
          <p className="sectionLead">
            Кейсы и реализованные решения. Откройте карточку, чтобы узнать подробнее.
          </p>
        </div>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
