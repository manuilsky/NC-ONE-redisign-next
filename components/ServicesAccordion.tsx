"use client";

import { useState } from "react";
import type { ServiceItem } from "@/data/home";
import styles from "./ServicesAccordion.module.css";

type ServicesAccordionProps = {
  items: ServiceItem[];
};

export function ServicesAccordion({ items }: ServicesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const open = item.id === openId;
        return (
          <article key={item.id} className={styles.item}>
            <button
              type="button"
              className={styles.header}
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className={styles.number}>{item.number}</span>
              <span className={styles.title}>{item.title}</span>
              <span className={open ? styles.iconOpen : styles.icon} aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            {open ? (
              <div className={styles.body}>
                <p>{item.description}</p>
                <div className={styles.tags}>
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
