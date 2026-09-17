import { ContactForm } from "@/components/ContactForm";
import { finalCta } from "@/data/home";
import styles from "./ContactSection.module.css";

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.label}>{finalCta.label}</p>
        <h2 className={styles.title}>
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
        </h2>
        <p className={styles.lead}>{finalCta.text}</p>

        <div className={styles.grid}>
          <div className={styles.contacts}>
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
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
