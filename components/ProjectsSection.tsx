import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { PortfolioCard } from "@/components/PortfolioCard";
import { projectsSection } from "@/data/home";
import { projects } from "@/data/projects";
import styles from "./ProjectsSection.module.css";

export function ProjectsSection() {
  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.label}>{projectsSection.label}</p>
          <h2 className={styles.title}>
            <span>{projectsSection.titleLine}</span>
            <span className={`textAccent ${styles.titleAccent}`}>
              {projectsSection.titleAccent}
            </span>
          </h2>
        </header>

        <Carousel ariaLabel="Наши проекты">
          {projects.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </Carousel>

        <div className={styles.ctaRow}>
          <Link href="/projects" className={`button buttonGhost ${styles.cta}`}>
            {projectsSection.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
