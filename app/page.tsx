import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import {
  about,
  finalCta,
  hero,
  homeProjects,
  partnerCta,
  projectsSection,
  services,
  servicesIntro,
  stats,
  whyUs,
} from "@/data/home";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>
            {hero.titleLines.map((line, i) => (
              <span
                key={line}
                className={i === hero.accentLineIndex ? "textAccent" : undefined}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.heroLead}>{hero.subtitle}</p>
          <Link href="/#contact" className="button">
            {hero.cta} <span aria-hidden="true">→</span>
          </Link>
          <p className={styles.scrollHint}>{hero.scrollHint}</p>
        </div>
      </section>

      <section id="about" className="section">
        <div className={`container ${styles.aboutGrid}`}>
          <div>
            <p className="sectionLabel">{about.label}</p>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.aboutText}>
                {paragraph}
              </p>
            ))}
            <Link href="/#contact" className={`button ${styles.aboutCta}`}>
              {about.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.statCard}>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="section">
        <div className="container">
          <p className="sectionLabel">[ почему мы ]</p>
          <h2 className="sectionTitle">Почему мы</h2>
          <p className="sectionLead">
            Принципы работы, которые снимают неопределённость на каждом этапе.
          </p>
          <Carousel ariaLabel="Почему мы">
            {whyUs.map((item) => (
              <article key={item.id} className={styles.whyCard}>
                <div className={styles.whyIcon} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </Carousel>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container">
          <p className="sectionLabel">{servicesIntro.label}</p>
          <h2 className="sectionTitle">{servicesIntro.title}</h2>
          <p className="sectionLead">{servicesIntro.lead}</p>
          <ServicesAccordion items={services} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.partnerCard}>
            <p className="sectionLabel">{partnerCta.label}</p>
            <h2 className={styles.partnerTitle}>
              {partnerCta.titleBefore}
              <span className="textAccent">{partnerCta.titleAccent}</span>
              {partnerCta.titleAfter}
            </h2>
            <div className={styles.partnerTags}>
              {partnerCta.tags.map((tag) => (
                <span key={tag} className="tag tagOutline">
                  {tag}
                </span>
              ))}
            </div>
            <Link href="/#contact" className="button">
              {partnerCta.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <div className={styles.projectsHead}>
            <div>
              <p className="sectionLabel">{projectsSection.label}</p>
              <h2 className="sectionTitle">{projectsSection.title}</h2>
            </div>
            <Link href="/projects" className="button buttonGhost">
              {projectsSection.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Carousel ariaLabel="Наши проекты">
            {homeProjects.map((project) => (
              <article key={project.slug} className={styles.projectCard}>
                <div className={styles.projectVisual} aria-hidden="true">
                  <span>{project.mark}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.projectTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/projects/${project.slug}`} className={styles.projectLink}>
                  Смотреть кейс →
                </Link>
              </article>
            ))}
          </Carousel>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <div className={styles.contactCard}>
            <h2 className="sectionTitle">{finalCta.title}</h2>
            <p className={styles.contactText}>{finalCta.text}</p>
            <div className={styles.contactRows}>
              <a href={`tel:${finalCta.phone.replace(/[^\d+]/g, "")}`}>
                {finalCta.phone}
              </a>
              <a href={`mailto:${finalCta.email}`}>{finalCta.email}</a>
            </div>
            <a href={`mailto:${finalCta.email}`} className="button">
              {finalCta.cta} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
