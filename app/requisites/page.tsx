import type { Metadata } from "next";
import Link from "next/link";
import { requisites } from "@/data/requisites";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Реквизиты",
  description: "Реквизиты компании НК 1: сведения о владельце сайта и банковские реквизиты.",
};

export default function RequisitesPage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <Link href={requisites.backHref} className={styles.back}>
            {requisites.backLabel}
          </Link>
          <p className={styles.label}>{requisites.label}</p>
          <h1 className={styles.title}>
            <span className={styles.titleWord}>{requisites.title}</span>{" "}
            <span className={styles.titleAccent}>{requisites.titleAccent}</span>
          </h1>
        </div>
      </div>

      <div className={styles.body}>
        <div className={`${styles.inner} ${styles.blocks}`}>
          {requisites.blocks.map((block) => (
            <article key={block.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{block.title}</h2>
              <ul className={styles.list}>
                {block.items.map((item) => (
                  <li
                    key={"text" in item ? item.text : item.value}
                    className={styles.item}
                  >
                    {"text" in item ? (
                      item.text
                    ) : (
                      <>
                        {item.prefix}
                        <a
                          href={item.href}
                          className={styles.itemLink}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {item.value}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
