"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { getProjectMark } from "@/data/projects";
import styles from "./PortfolioCard.module.css";

type PortfolioCardProps = {
  project: Project;
};

const TAG_ROWS = 2;
const TAG_GAP = 8;

function fitTagCount(
  widths: number[],
  moreWidth: number,
  containerWidth: number,
) {
  if (!widths.length || containerWidth <= 0) return widths.length;

  const canPack = (count: number, withMore: boolean) => {
    let row = 0;
    let x = 0;
    const items = widths.slice(0, count);
    if (withMore) items.push(moreWidth);

    for (const w of items) {
      if (x === 0) {
        x = w;
        continue;
      }
      if (x + TAG_GAP + w <= containerWidth + 0.5) {
        x += TAG_GAP + w;
        continue;
      }
      row += 1;
      if (row >= TAG_ROWS) return false;
      x = w;
    }
    return true;
  };

  if (canPack(widths.length, false)) return widths.length;

  for (let count = widths.length - 1; count >= 1; count -= 1) {
    if (canPack(count, true)) return count;
  }
  return 1;
}

function PortfolioTags({ tags }: { tags: string[] }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(tags.length);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;

    const update = () => {
      const chips = Array.from(measure.children) as HTMLElement[];
      if (chips.length < 2) return;
      const more = chips[chips.length - 1];
      const tagEls = chips.slice(0, -1);
      setShown(
        fitTagCount(
          tagEls.map((el) => el.offsetWidth),
          more.offsetWidth,
          measure.clientWidth,
        ),
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [tags]);

  const extra = tags.length - shown;

  return (
    <div className={styles.tagsWrap}>
      <div ref={measureRef} className={styles.tagsMeasure} aria-hidden="true">
        {tags.map((tag) => (
          <span key={tag} className="techChip">
            {tag}
          </span>
        ))}
        <span className={styles.tagMore}>+99</span>
      </div>
      <div className={styles.tags}>
        {tags.slice(0, shown).map((tag) => (
          <span key={tag} className="techChip">
            {tag}
          </span>
        ))}
        {extra > 0 ? (
          <span className={styles.tagMore}>+{extra}</span>
        ) : null}
      </div>
    </div>
  );
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const mark = getProjectMark(project);
  const hasCover = Boolean(project.cover);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={styles.card}
      aria-label={`${project.title}. Открыть кейс`}
    >
      <div className={styles.media}>
        {hasCover && project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="400px"
            className={styles.cover}
          />
        ) : (
          <>
            <span className={styles.glow} aria-hidden="true" />
            <span className={styles.mark} aria-hidden="true">
              {mark}
            </span>
          </>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.head}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.desc}>{project.desc}</p>
        </div>
        <PortfolioTags tags={project.tags} />
      </div>
    </Link>
  );
}
