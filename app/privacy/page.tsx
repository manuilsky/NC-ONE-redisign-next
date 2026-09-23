import type { Metadata } from "next";
import Link from "next/link";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import { privacy } from "@/data/privacy";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Политика в отношении обработки персональных данных",
  description:
    "Политика обработки персональных данных ИП Меньщиков Алексей Васильевич для сайта ncomsoft.ru.",
};

export default function PrivacyPage() {
  return (
    <section className={styles.page}>
      <StarfieldTunnel />
      <div className={styles.hero}>
        <div className={styles.inner}>
          <Link href={privacy.backHref} className={styles.back}>
            {privacy.backLabel}
          </Link>
          <p className={styles.label}>{privacy.label}</p>
          <h1
            className={styles.title}
            aria-label="Политика в отношении обработки персональных данных"
          >
            <span className={styles.titleWord}>{privacy.title}</span>{" "}
            <span className={styles.titleAccent}>{privacy.titleAccent}</span>
          </h1>
          <p className={styles.updated}>{privacy.updated}</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={`${styles.inner} ${styles.blocks}`}>
          {privacy.blocks.map((block) => (
            <article
              key={
                block.title ??
                block.paragraphs?.[0] ??
                block.items?.[0] ??
                "block"
              }
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
              {block.afterItems?.map((paragraph) => (
                <p key={paragraph} className={styles.text}>
                  {paragraph}
                </p>
              ))}
              {block.table ? (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {block.table.headers.map((header) => (
                          <th key={header} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.table.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell) => (
                            <td key={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
