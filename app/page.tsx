import { ContactSection } from "@/components/ContactSection";
import { HashLink } from "@/components/HashLink";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Reveal } from "@/components/Reveal";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { about, hero, stats, whyUs } from "@/data/home";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal as="h1" className={styles.heroTitle} distance="lg">
            {hero.titleLines.map((line, i) => (
              <span
                key={line}
                className={i === hero.accentLineIndex ? "textAccent" : undefined}
              >
                {line}
              </span>
            ))}
          </Reveal>
          <Reveal as="p" className={styles.heroLead} delay={120}>
            {hero.subtitle}
          </Reveal>
          <Reveal delay={200}>
            <HashLink href="/#contact" className="button">
              {hero.cta} <span aria-hidden="true">→</span>
            </HashLink>
          </Reveal>
          <Reveal as="p" className={styles.scrollHint} delay={280}>
            {hero.scrollHint}
          </Reveal>
        </div>
      </section>

      <section id="about" className={styles.about}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutTextCol}>
            <Reveal as="p" className={styles.aboutLabel}>
              {about.label}
            </Reveal>
            {about.paragraphs.map((paragraph, i) => (
              <Reveal
                as="p"
                key={paragraph.slice(0, 24)}
                className={styles.aboutText}
                delay={80 + i * 80}
              >
                {paragraph}
              </Reveal>
            ))}
            <Reveal delay={240} className={styles.aboutCta}>
              <HashLink href="/#contact" className="button">
                {about.cta} <span aria-hidden="true">→</span>
              </HashLink>
            </Reveal>
          </div>
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <Reveal
                as="article"
                key={stat.label}
                className={styles.statCard}
                delay={i * 70}
              >
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
              </Reveal>
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
