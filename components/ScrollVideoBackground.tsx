"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollVideoBackground.module.css";

type ScrollVideoBackgroundProps = {
  src?: string;
  poster?: string;
};

export function ScrollVideoBackground({
  src,
  poster,
}: ScrollVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let ready = false;

    const syncToScroll = () => {
      rafRef.current = null;
      if (!ready || !video.duration || !Number.isFinite(video.duration)) return;

      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      video.currentTime = progress * video.duration;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(syncToScroll);
    };

    const onReady = () => {
      ready = true;
      video.pause();
      syncToScroll();
    };

    if (video.readyState >= 1) onReady();
    else video.addEventListener("loadedmetadata", onReady);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.fallback} />
      {src ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
        />
      ) : null}
      <div className={styles.veil} />
    </div>
  );
}
