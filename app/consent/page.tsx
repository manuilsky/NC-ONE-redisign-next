import type { Metadata } from "next";
import Link from "next/link";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import { consent } from "@/data/consent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие на обработку персональных данных при отправке формы на сайте ncomsoft.ru.",
};

export default function ConsentPage() {
  return (
    <section className={styles.page}>
      <StarfieldTunnel />
      <div className={styles.hero}>
        <div className={styles.inner}>
          <Link href={consent.backHref} className={styles.back}>
            {consent.backLabel}
          </Link>
          <p className={styles.label}>{consent.label}</p>
          <h1
            className={styles.title}
            aria-label="Согласие на обработку персональных данных"
          >
            <span className={styles.titleWord}>{consent.title}</span>
            {"\u00A0"}
            <span className={styles.titleAccent}>{consent.titleAccent}</span>
          </h1>
          <p className={styles.related}>
            {consent.related.prefix}
            <Link href={consent.related.href} className={styles.relatedLink}>
              {consent.related.label}
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={`${styles.inner} ${styles.blocks}`}>
          {consent.blocks.map((block) => (
            <article
              key={block.title ?? block.paragraphs?.[0] ?? block.items?.[0]}
              className={styles.card}
            >
              {block.title ? (
                <h2 className={styles.cardTitle}>{block.title}</h2>
              ) : null}
              {block.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.text}>
                  {paragraph}
                </p>
              ))}
              {block.items ? (
                <ul className={styles.list}>
                  {block.items.map((item) => (
                    <li key={item} className={styles.item}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
