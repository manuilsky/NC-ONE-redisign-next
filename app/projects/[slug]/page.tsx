import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/data/projects";
import styles from "./page.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Проект не найден" };
  }

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <Link href="/projects" className={styles.back}>
          ← Ко всем проектам
        </Link>
        <p className={styles.meta}>
          {project.category} · {project.year}
        </p>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.panel}>
          <h2>Что дальше</h2>
          <p>
            Здесь позже можно добавить галерею, результаты и отзыв клиента.
          </p>
        </div>
      </div>
    </section>
  );
}
