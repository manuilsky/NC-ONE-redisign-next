import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { finalCta } from "@/data/home";
import styles from "./ContactSection.module.css";

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <Reveal as="p" className={styles.label}>
          {finalCta.label}
        </Reveal>
        <Reveal as="h2" className={styles.title} distance="lg" delay={80}>
          {finalCta.titleLines.map((line, i) => (
            <span
              key={line}
              className={
                i === finalCta.accentLineIndex ? styles.titleAccent : undefined
              }
            >
              {line}
            </span>
          ))}
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={140}>
          {finalCta.text}
        </Reveal>

        <div className={styles.grid}>
          <Reveal as="div" className={styles.contacts} delay={80}>
            <a href={finalCta.phoneHref} className={styles.phone}>
              {finalCta.phone}
            </a>
            <a href={`mailto:${finalCta.email}`} className={styles.email}>
              {finalCta.email}
            </a>
            <a
              href={finalCta.telegramHref}
              className={styles.telegram}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/icons/telegram.svg"
                alt=""
                width={16}
                height={16}
                className={styles.telegramIcon}
              />
              {finalCta.telegramLabel}
            </a>
          </Reveal>
          <Reveal delay={160}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
