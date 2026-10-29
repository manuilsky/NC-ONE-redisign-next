import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
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
import { HashLink } from "@/components/HashLink";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import {
  caseCtaChips,
  getCategoryLabel,
  getProjectBySlug,
  getProjectMark,
  getProjectPosition,
  projects,
  stripProjectLinks,
  type CaseFact,
  type Project,
} from "@/data/projects";
import { withBasePath } from "@/lib/paths";
import styles from "./page.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const factIcons: Record<CaseFact["icon"], ReactNode> = {
  platform: <IconPlatform />,
  team: <IconTeam />,
  duration: <IconDuration />,
  type: <IconType />,
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

  const keywords = project.seoCluster
    ? project.seoCluster
        .split(/\s*→\s*/)
        .map((part) => part.trim())
        .filter(Boolean)
    : undefined;

  return {
    title: project.seoTitle || project.title,
    description:
      project.seoDescription || stripProjectLinks(project.desc),
    ...(keywords?.length ? { keywords } : {}),
  };
}

function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

function splitParagraphs(text: string) {
  return text.split(/\n\n+/).filter(Boolean);
}

/** Рендерит текст с инлайн-ссылками вида [анкор](/projects/slug) */
function renderLinkedText(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\((\/projects\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={`link-${key++}`} href={match[2]} className={styles.inlineLink}>
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

const FACT_ORDER: CaseFact["icon"][] = [
  "platform",
  "team",
  "type",
  "duration",
];

function orderFacts(facts: CaseFact[]) {
  return [...facts].sort(
    (a, b) => FACT_ORDER.indexOf(a.icon) - FACT_ORDER.indexOf(b.icon),
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { index, total, next } = getProjectPosition(slug);
  const mark = getProjectMark(project);
  const nextMark = getProjectMark(next);
  const related = project.relatedCase
    ? getProjectBySlug(project.relatedCase.slug)
    : undefined;
  const relatedMark = related ? getProjectMark(related) : null;
  const categoryLabel = getCategoryLabel(project.categories[0] ?? "all");
  const ctaTitle = project.ctaTitle
    ? project.ctaTitle
    : project.type
      ? `Нужна разработка ${project.type}?`
      : "Готовы обсудить похожий проект?";

  const seoJsonLd =
    project.seoHeading || project.seoCluster
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.seoHeading || project.seoTitle || project.title,
          description:
            project.seoDescription || stripProjectLinks(project.desc),
          name: project.title,
          ...(project.seoCluster
            ? {
                keywords: project.seoCluster
                  .split(/\s*→\s*/)
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .join(", "),
              }
            : {}),
        }
      : null;

  return (
    <article className={styles.page}>
      {seoJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }}
        />
      ) : null}
      <StarfieldTunnel />
      <section className={styles.hero}>
        <div className="container">
          <Link href="/projects" className={styles.back}>
            <IconBack />
            Все проекты
          </Link>

          <div className={styles.eyebrow}>
            <span className={styles.category}>{categoryLabel}</span>
            <span className={styles.index}>
              {padIndex(index + 1)} / {padIndex(total)}
            </span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.copy}>
              <p className={styles.subtitle}>{project.subtitle}</p>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.lead}>{renderLinkedText(project.desc)}</p>

              <dl className={styles.facts}>
                {orderFacts(project.facts).map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <span className={styles.factIcon}>{factIcons[fact.icon]}</span>
                    <div className={styles.factBody}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className={styles.actions}>
                <HashLink href="/#contact" className="button">
                  Обсудить проект <span aria-hidden="true">→</span>
                </HashLink>
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
              <p className={styles.stackNote}>{project.stackReason}</p>
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
            <p>{project.clientInfo}</p>
          </article>
          <article className={styles.introCard}>
            <span className={styles.introIcon}>
              <IconTask />
            </span>
            <h2>Задача</h2>
            <p>{renderLinkedText(project.problem)}</p>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-label="Уникальность проекта">
        <div className="container">
          <p className={styles.label}>[ уникальность проекта ]</p>
          <ul className={styles.highlights}>
            {project.highlights.map((item) => (
              <li key={item.title}>
                <span className={styles.check}>
                  <IconCheck />
                </span>
                <div>
                  <h3>{renderLinkedText(item.title)}</h3>
                  <p>{renderLinkedText(item.desc)}</p>
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
              {project.solutionPoints.map((item, i) => (
                <li key={i}>
                  <span className={`${styles.check} ${styles.checkSm}`}>
                    <IconCheck />
                  </span>
                  <p>{renderLinkedText(item)}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.resultsCard}>
            <p className={styles.resultLabel}>
              <IconSpark />
              [ результат ]
            </p>
            {project.results && project.results.length > 0 ? (
              <div className={styles.stats}>
                {project.results.map((stat) => (
                  <div key={stat.label}>
                    <p className={styles.statValue}>{stat.value}</p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {splitParagraphs(project.resultsSummary).map((paragraph) => (
              <p key={paragraph} className={styles.resultNote}>
                {renderLinkedText(paragraph)}
              </p>
            ))}
          </article>
        </div>
      </section>

      <section className={styles.section} aria-label="Скриншоты">
        <div className="container">
          <p className={styles.label}>[ скриншоты ]</p>
          <ul className={styles.gallery}>
            {Array.from({ length: 3 }, (_, shot) => {
              const src = project.shots?.[shot];
              const alt = project.imageAlts?.[shot + 1] ?? "";
              return (
                <li key={shot}>
                  {src ? (
                    <Image
                      src={withBasePath(src)}
                      alt={alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.galleryImg}
                    />
                  ) : (
                    <span
                      role={alt ? "img" : undefined}
                      aria-label={alt || undefined}
                    >
                      {mark}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={styles.closing}>
        <div className="container">
          <div className={styles.cta}>
            <p className={styles.label}>[ следующий шаг ]</p>
            <h2>{ctaTitle}</h2>
            <p className={styles.ctaText}>{renderLinkedText(project.ctaText)}</p>
            <ul className={styles.chips}>
              {caseCtaChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
            <HashLink href="/#contact" className="button">
              Обсудить проект <span aria-hidden="true">→</span>
            </HashLink>
          </div>

          <Link href="/projects" className={`button buttonGhost ${styles.allProjects}`}>
            Все проекты <span aria-hidden="true">→</span>
          </Link>

          {related && project.relatedCase ? (
            <Link
              href={`/projects/${related.slug}`}
              className={styles.next}
              aria-label={`${project.relatedCase.label}: ${related.title}`}
            >
              <span className={styles.nextText}>
                <span className={styles.label}>
                  [ {project.relatedCase.label.toLowerCase()} ]
                </span>
                <span className={styles.nextTitle}>{related.title}</span>
              </span>
              <span className={styles.nextMark} aria-hidden="true">
                {relatedMark}
              </span>
              <IconArrow className={styles.nextArrow} />
            </Link>
          ) : null}

          {!related || next.slug !== related.slug ? (
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
          ) : null}
        </div>
      </section>

      {project.seoHeading || project.seoCluster ? (
        <section className={styles.seoOnly}>
          {project.seoHeading ? <h2>{project.seoHeading}</h2> : null}
          {project.seoCluster ? <p>{project.seoCluster}</p> : null}
          {project.imageAlts?.length ? (
            <ul>
              {project.imageAlts.map((alt) => (
                <li key={alt}>{alt}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}

function DeviceMock({ project }: { project: Project }) {
  return (
    <div className={styles.mockWrap} aria-hidden="true">
      <div className={styles.mock}>
        <div className={styles.mockBar}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.mockScreen}>
          {project.cover ? (
            <Image
              src={withBasePath(project.cover)}
              alt={project.imageAlts?.[0] ?? ""}
              fill
              sizes="440px"
              priority
            />
          ) : (
            <span>Screenshot</span>
          )}
        </div>
      </div>
    </div>
  );
}
