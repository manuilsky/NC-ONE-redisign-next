"use client";

import { useState } from "react";
import type { ServiceItem } from "@/data/home";
import { Reveal } from "@/components/Reveal";
import styles from "./ServicesAccordion.module.css";

type ServicesAccordionProps = {
  items: ServiceItem[];
};

function IconPlus() {
  return (
    <svg
      className={styles.iconSvg}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg
      className={styles.iconSvg}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicesAccordion({ items }: ServicesAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.list}>
          {items.map((item, index) => {
        const open = openIds.has(item.id);
        const panelId = `service-panel-${item.id}`;
        const headerId = `service-header-${item.id}`;

        return (
          <Reveal
            as="article"
            key={item.id}
            className={styles.item}
            delay={index * 50}
            distance="sm"
          >
            <h3 className={styles.heading}>
              <button
                id={headerId}
                type="button"
                className={styles.header}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className={styles.number}>{item.number}</span>
                <span className={styles.title}>{item.title}</span>
                <span
                  className={open ? styles.toggleOpen : styles.toggle}
                  aria-hidden="true"
                >
                  {open ? <IconMinus /> : <IconPlus />}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={open ? styles.panel : styles.panelCollapsed}
              hidden={!open}
            >
              <p className={styles.description}>{item.description}</p>
              <div className={styles.tags}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.chip}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
