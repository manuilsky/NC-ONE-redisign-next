import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrow,
  IconBack,
  IconCheck,
  IconClient,
  IconDuration,
  IconPlatform,
  IconSpark,
  IconTask,
  IconTeam,
  IconType,
} from "@/components/CaseIcons";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import {
  caseCta,
  getProjectBySlug,
  getProjectMark,
  getProjectPosition,
  projects,
  type Project,
} from "@/data/projects";
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

function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { index, total, next } = getProjectPosition(slug);
  const study = project.caseStudy;
  const mark = getProjectMark(project);
  const nextMark = getProjectMark(next);
  const facts = [
    { icon: <IconPlatform />, label: "Платформа", value: study.platform },
    { icon: <IconTeam />, label: "Команда", value: study.team },
    { icon: <IconType />, label: "Тип проекта", value: study.projectType },
    { icon: <IconDuration />, label: "Срок разработки", value: study.duration },
  ];

  return (
    <article className={styles.page}>
      <StarfieldTunnel />
      <section className={styles.hero}>
        <div className="container">
          <Link href="/projects" className={styles.back}>
            <IconBack />
            Все проекты
          </Link>

          <div className={styles.eyebrow}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.index}>
              {padIndex(index + 1)} / {padIndex(total)}
            </span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.copy}>
              <p className={styles.subtitle}>{study.subtitle}</p>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.lead}>{project.shortDescription}</p>

              <dl className={styles.facts}>
                {facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <span className={styles.factIcon}>{fact.icon}</span>
                    <div>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className={styles.actions}>
                <Link href="/#contact" className="button">
                  Обсудить проект <span aria-hidden="true">→</span>
                </Link>
                <Link href="/projects" className="button buttonGhost">
                  Все кейсы
                </Link>
              </div>
            </div>

            <DeviceMock project={project} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Стек">
        <div className="container">
          <div className={styles.stack}>
            <div className={styles.stackInfo}>
              <p className={styles.label}>[ стек ]</p>
              <p className={styles.stackNote}>{study.stackNote}</p>
            </div>
            <ul className={styles.tags}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="О клиенте и задача">
        <div className={`container ${styles.introGrid}`}>
          <article className={styles.introCard}>
            <span className={styles.introIcon}>
              <IconClient />
            </span>
            <h2>О клиенте</h2>
            <p>{study.client}</p>
          </article>
          <article className={styles.introCard}>
            <span className={styles.introIcon}>
              <IconTask />
            </span>
            <h2>Задача</h2>
            <p>{study.task}</p>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-label="Уникальность проекта">
        <div className="container">
          <p className={styles.label}>[ уникальность проекта ]</p>
          <ul className={styles.highlights}>
            {study.highlights.map((item) => (
              <li key={item.title}>
                <span className={styles.check}>
                  <IconCheck />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-label="Решение и результат">
        <div className={`container ${styles.solutionGrid}`}>
          <article className={styles.solutionCard}>
            <p className={styles.label}>[ решение ]</p>
            <ul className={styles.solutionList}>
              {study.solution.map((item) => (
                <li key={item}>
                  <span className={`${styles.check} ${styles.checkSm}`}>
                    <IconCheck />
                  </span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.resultsCard}>
            <p className={styles.resultLabel}>
              <IconSpark />
              [ результат ]
            </p>
            <div className={styles.stats}>
              {study.stats.map((stat) => (
                <div key={stat.label}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
            <p className={styles.resultNote}>{study.resultNote}</p>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-label="Скриншоты">
        <div className="container">
          <p className={styles.label}>[ скриншоты ]</p>
          <ul className={styles.gallery}>
            {Array.from({ length: 3 }, (_, shot) => (
              <li key={shot}>
                <span>{mark}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.closing}>
        <div className="container">
          <div className={styles.cta}>
            <p className={styles.label}>[ следующий шаг ]</p>
            <h2>
              <span>Нужна разработка</span>
              <span>{study.productType}?</span>
            </h2>
            <p className={styles.ctaText}>{caseCta.text}</p>
            <ul className={styles.chips}>
              {caseCta.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
            <Link href="/#contact" className="button">
              Обсудить проект <span aria-hidden="true">→</span>
            </Link>
          </div>

          <Link href="/projects" className={`button buttonGhost ${styles.allProjects}`}>
            Все проекты <span aria-hidden="true">→</span>
          </Link>

          <Link
            href={`/projects/${next.slug}`}
            className={styles.next}
            aria-label={`Следующий кейс: ${next.title}`}
          >
            <span className={styles.nextText}>
              <span className={styles.label}>[ следующий проект ]</span>
              <span className={styles.nextTitle}>{next.title}</span>
            </span>
            <span className={styles.nextMark} aria-hidden="true">
              {nextMark}
            </span>
            <IconArrow className={styles.nextArrow} />
          </Link>
        </div>
      </section>
    </article>
  );
}

function DeviceMock({ project }: { project: Project }) {
  return (
    <div className={styles.mock} aria-hidden="true">
      <div className={styles.mockBar}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.mockScreen}>
        {project.cover ? (
          <Image src={project.cover} alt="" fill sizes="440px" />
        ) : (
          <span>Screenshot</span>
        )}
      </div>
    </div>
  );
}
