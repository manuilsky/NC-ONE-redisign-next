import type { Metadata } from "next";
import Link from "next/link";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import { cookies } from "@/data/cookies";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Уведомление об использовании cookie",
  description:
    "Сайт ncomsoft.ru использует только необходимые технические cookie для корректной и безопасной работы.",
};

export default function CookiesPage() {
  return (
    <section className={styles.page}>
      <StarfieldTunnel />
      <div className={styles.hero}>
        <div className={styles.inner}>
          <Link href={cookies.backHref} className={styles.back}>
            {cookies.backLabel}
          </Link>
          <p className={styles.label}>{cookies.label}</p>
          <h1
            className={styles.title}
            aria-label="Уведомление об использовании cookie"
          >
            <span className={styles.titleWord}>{cookies.title}</span>{" "}
            <span className={styles.titleAccent}>{cookies.titleAccent}</span>
          </h1>
        </div>
      </div>

      <div className={styles.body}>
        <div className={`${styles.inner} ${styles.blocks}`}>
          {cookies.blocks.map((block) => (
            <article
              key={block.title ?? block.paragraphs[0]}
              className={styles.card}
            >
              {block.title ? (
                <h2 className={styles.cardTitle}>{block.title}</h2>
              ) : null}
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.text}>
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
