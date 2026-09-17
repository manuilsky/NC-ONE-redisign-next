import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ServicesAccordion } from "@/components/ServicesAccordion";
import {
  partnerCta,
  services,
  servicesIntro,
  servicesMore,
} from "@/data/home";
import styles from "./ServicesSection.module.css";

export function ServicesSection() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.inner}>
        <Reveal as="header" className={styles.head} distance="lg">
          <p className={styles.label}>{servicesIntro.label}</p>
          <h2 className={styles.title}>{servicesIntro.title}</h2>
          <p className={styles.lead}>{servicesIntro.lead}</p>
        </Reveal>

        <ServicesAccordion items={services} />

        <Reveal as="p" className={styles.more} distance="sm">
          {servicesMore}
        </Reveal>

        <Reveal as="div" className={styles.partnerCard} distance="lg">
          <p className={styles.partnerLabel}>{partnerCta.label}</p>
          <h2 className={styles.partnerTitle}>
            <span className={styles.partnerTitleLine}>
              {partnerCta.titleLine}
            </span>
            <span className={`textAccent ${styles.partnerTitleLine}`}>
              {partnerCta.titleAccent}
            </span>
          </h2>
          <p className={styles.partnerText}>{partnerCta.text}</p>
          <div className={styles.partnerTags}>
            {partnerCta.tags.map((tag) => (
              <span key={tag} className="techChip">
                {tag}
              </span>
            ))}
          </div>
          <Link href="/#contact" className={`button ${styles.partnerCta}`}>
            {partnerCta.cta} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
