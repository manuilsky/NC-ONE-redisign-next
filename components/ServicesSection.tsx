import Link from "next/link";
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
        <header className={styles.head}>
          <p className={styles.label}>{servicesIntro.label}</p>
          <h2 className={styles.title}>{servicesIntro.title}</h2>
          <p className={styles.lead}>{servicesIntro.lead}</p>
        </header>

        <ServicesAccordion items={services} />

        <p className={styles.more}>{servicesMore}</p>

        <div className={styles.partnerCard}>
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
              <span key={tag} className={styles.partnerChip}>
                {tag}
              </span>
            ))}
          </div>
          <Link href="/#contact" className={`button ${styles.partnerCta}`}>
            {partnerCta.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
