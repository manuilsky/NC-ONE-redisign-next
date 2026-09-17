import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { about, hero, stats, whyUs } from "@/data/home";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
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

      <section id="about" className={styles.about}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutTextCol}>
            <p className={styles.aboutLabel}>{about.label}</p>
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
                <p
                  className={
                    stat.compactLabel
                      ? `${styles.statLabel} ${styles.statLabelCompact}`
                      : styles.statLabel
                  }
                >
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhyUsSection items={whyUs} />

      <ServicesSection />

      <ProjectsSection />

      <ContactSection />
    </>
  );
}
