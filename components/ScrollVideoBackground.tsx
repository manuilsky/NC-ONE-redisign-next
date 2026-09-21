"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollVideoBackground.module.css";

type ScrollVideoBackgroundProps = {
  src?: string;
  poster?: string;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

const FRAME_SECONDS = 0.2;
const SLOW_SEEK_MS = 120;
const FAIL_SEEK_MS = 220;

function canUseScrollVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType === "slow-2g") return false;
  if (nav.connection?.effectiveType === "2g") return false;
  if (nav.deviceMemory != null && nav.deviceMemory <= 2) return false;
  if (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) {
    return false;
  }

  return true;
}

function snapTime(raw: number, step: number, duration: number) {
  const snapped = Math.round(raw / step) * step;
  return Math.min(Math.max(snapped, 0), Math.max(duration - 0.001, 0));
}

export function ScrollVideoBackground({
  src,
  poster,
}: ScrollVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (!canUseScrollVideo()) return;
    setUseVideo(true);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !useVideo) return;

    let ready = false;
    let seeking = false;
    let pending: number | null = null;
    let raf = 0;
    let lastApplied = -1;
    let step = FRAME_SECONDS;
    let seekStartedAt = 0;
    const seekDurations: number[] = [];

    const targetTime = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      return snapTime(progress * video.duration, step, video.duration);
    };

    const apply = (time: number) => {
      if (!ready || document.hidden) return;
      if (Math.abs(time - lastApplied) < step * 0.49) return;

      if (seeking) {
        pending = time;
        return;
      }

      lastApplied = time;
      seeking = true;
      seekStartedAt = performance.now();
      video.currentTime = time;
    };

    const syncToScroll = () => {
      raf = 0;
      apply(targetTime());
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(syncToScroll);
    };

    const onSeeked = () => {
      const elapsed = performance.now() - seekStartedAt;
      seeking = false;

      seekDurations.push(elapsed);
      if (seekDurations.length >= 6) {
        const avg =
          seekDurations.reduce((sum, value) => sum + value, 0) /
          seekDurations.length;
        seekDurations.length = 0;

        if (avg >= FAIL_SEEK_MS) {
          setUseVideo(false);
          return;
        }
        if (avg >= SLOW_SEEK_MS) {
          step = Math.min(step * 2, 0.8);
        }
      }

      if (pending != null) {
        const next = pending;
        pending = null;
        apply(next);
      }
    };

    const onReady = () => {
      ready = true;
      video.pause();
      syncToScroll();
    };

    const onVisibility = () => {
      if (document.hidden) {
        pending = null;
        return;
      }
      schedule();
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (motion.matches) setUseVideo(false);
    };

    if (video.readyState >= 1) onReady();
    else video.addEventListener("loadedmetadata", onReady);

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [src, useVideo]);

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.fallback} />
      {poster ? (
        <img
          className={styles.video}
          src={poster}
          alt=""
          decoding="async"
        />
      ) : null}
      {useVideo && src ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      ) : null}
      <div className={styles.veil} />
    </div>
  );
}
