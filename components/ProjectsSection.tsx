import Link from "next/link";
import { Fragment } from "react";
import { Carousel } from "@/components/Carousel";
import { PortfolioCard } from "@/components/PortfolioCard";
import { Reveal } from "@/components/Reveal";
import { projectsSection } from "@/data/home";
import { projects } from "@/data/projects";
import styles from "./ProjectsSection.module.css";

const HOME_PROJECTS_LIMIT = 6;

function TitlePart({
  chunks,
  className,
}: {
  chunks: readonly string[];
  className?: string;
}) {
  return (
    <span className={className}>
      {chunks.map((chunk, i) => (
        <Fragment key={chunk}>
          {i > 0 ? <span className={styles.titleSpace}> </span> : null}
          <span>{chunk}</span>
        </Fragment>
      ))}
    </span>
  );
}

export function ProjectsSection() {
  const homeProjects = projects.slice(0, HOME_PROJECTS_LIMIT);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <Reveal as="header" className={styles.head} distance="lg">
          <p className={styles.label}>{projectsSection.label}</p>
          <h2 className={styles.title}>
            <TitlePart
              chunks={projectsSection.titleChunks}
              className={styles.titlePlain}
            />
            <TitlePart
              chunks={projectsSection.titleAccentChunks}
              className={`textAccent ${styles.titleAccent}`}
            />
          </h2>
        </Reveal>

        <Reveal>
          <Carousel ariaLabel="Наши проекты">
            {homeProjects.map((project) => (
              <PortfolioCard key={project.slug} project={project} />
            ))}
          </Carousel>
        </Reveal>

        <Reveal className={styles.ctaRow} delay={80}>
          <Link href="/projects" className={`button buttonGhost ${styles.cta}`}>
            {projectsSection.cta} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
