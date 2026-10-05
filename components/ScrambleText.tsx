"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrambleText.module.css";

/** Glyphs observed in the reference recording (scramble frames). */
const GLYPHS =
  "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|#%^*?()";

/** Hold each random glyph long enough to read (~12.5 fps). */
const SCRAMBLE_TICK_MS = 120;
/** Pause before left-to-right resolve starts. */
const RESOLVE_DELAY_MS = 120;
/** Time between locking consecutive characters. */
const RESOLVE_STEP_MS = 120;

type ScrambleTextProps = {
  text: string;
  className?: string;
  as?: "span" | "h3";
};

function isStableChar(char: string) {
  return (
    char === " " ||
    char === "\u00a0" ||
    char === ":" ||
    char === "." ||
    char === "/" ||
    char === "-" ||
    char === "—" ||
    char === "–" ||
    char === "&"
  );
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "А";
}

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
}: ScrambleTextProps) {
  const [chars, setChars] = useState(() => text.split(""));
  const frameRef = useRef<number | null>(null);
  const scrambleRef = useRef<number | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    setChars(text.split(""));
  }, [text]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (scrambleRef.current !== null) window.clearInterval(scrambleRef.current);
    };
  }, []);

  const stop = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (scrambleRef.current !== null) {
      window.clearInterval(scrambleRef.current);
      scrambleRef.current = null;
    }
  };

  const play = () => {
    if (typeof window === "undefined") return;
    if (playedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    playedRef.current = true;
    stop();

    const original = text.split("");
    const locked = original.map((char) => isStableChar(char));
    let cursor = 0;
    const startedAt = performance.now();

    const paint = () => {
      setChars(original.map((char, i) => (locked[i] ? char : randomGlyph())));
    };

    paint();
    scrambleRef.current = window.setInterval(paint, SCRAMBLE_TICK_MS);

    const tick = (now: number) => {
      const elapsed = now - startedAt - RESOLVE_DELAY_MS;
      if (elapsed >= 0) {
        const target = Math.min(
          original.length,
          Math.floor(elapsed / RESOLVE_STEP_MS),
        );

        while (cursor < target) {
          locked[cursor] = true;
          cursor += 1;
        }

        paint();
      }

      if (cursor >= original.length) {
        stop();
        setChars(original);
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <Tag
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-label={text}
      onMouseEnter={play}
    >
      {chars.map((char, i) => (
        <span
          key={`${text}-${i}`}
          className={styles.char}
          data-char={text[i] === " " ? "\u00a0" : text[i]}
          aria-hidden="true"
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </Tag>
  );
}
