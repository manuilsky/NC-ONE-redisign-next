"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollVideoBackground.module.css";

type ScrollVideoBackgroundProps = {
  src?: string;
  poster?: string;
};

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

const FRAME_SECONDS = 0.2;
const MOBILE_FRAME_SECONDS = 0.4;
const SEEK_WATCHDOG_MS = 280;

function canUseScrollVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType === "slow-2g") return false;
  if (nav.connection?.effectiveType === "2g") return false;

  return true;
}

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
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
    let step = isCoarsePointer() ? MOBILE_FRAME_SECONDS : FRAME_SECONDS;
    let seekWatchdog = 0;
    let disposed = false;

    const targetTime = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      return snapTime(progress * video.duration, step, video.duration);
    };

    const finishSeek = () => {
      if (seekWatchdog) {
        window.clearTimeout(seekWatchdog);
        seekWatchdog = 0;
      }
      seeking = false;

      if (pending != null) {
        const next = pending;
        pending = null;
        apply(next);
      }
    };

    const apply = (time: number) => {
      if (!ready || disposed || document.hidden) return;
      if (Math.abs(time - lastApplied) < step * 0.49) return;

      if (seeking) {
        pending = time;
        return;
      }

      lastApplied = time;
      seeking = true;

      try {
        video.currentTime = time;
      } catch {
        finishSeek();
        return;
      }

      // Safari/iOS often never fires `seeked` on a paused scrub video.
      seekWatchdog = window.setTimeout(finishSeek, SEEK_WATCHDOG_MS);
    };

    const syncToScroll = () => {
      raf = 0;
      apply(targetTime());
    };

    const schedule = () => {
      if (raf || disposed) return;
      raf = window.requestAnimationFrame(syncToScroll);
    };

    const markReady = () => {
      if (ready || disposed) return;
      ready = true;
      video.pause();
      syncToScroll();
    };

    let armed = false;
    let arming = false;

    const disarmGestures = () => {
      window.removeEventListener("touchstart", armDecoder);
      window.removeEventListener("pointerdown", armDecoder);
    };

    // Real iPhones will not paint scrubbed frames until media is play()-unlocked
    // by a user gesture. First successful play/pause is enough; then we scrub.
    const armDecoder = () => {
      if (disposed || armed || arming) return;
      arming = true;

      const attempt = video.play();
      if (attempt && typeof attempt.then === "function") {
        attempt
          .then(() => {
            arming = false;
            if (disposed || armed) return;
            video.pause();
            armed = true;
            disarmGestures();
            syncToScroll();
          })
          .catch(() => {
            arming = false;
            // Retry on the next gesture (src may still be loading).
          });
      } else {
        arming = false;
        video.pause();
        armed = true;
        disarmGestures();
        syncToScroll();
      }
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

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (video.readyState >= 1) markReady();
    else video.addEventListener("loadedmetadata", markReady);

    video.addEventListener("seeked", finishSeek);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);

    // Only real gestures unlock decoding on iOS (scroll alone is not enough).
    window.addEventListener("touchstart", armDecoder, { passive: true });
    window.addEventListener("pointerdown", armDecoder, { passive: true });

    // Desktop muted autoplay is usually allowed — arm immediately.
    if (!isCoarsePointer()) armDecoder();

    return () => {
      disposed = true;
      if (seekWatchdog) window.clearTimeout(seekWatchdog);
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("seeked", finishSeek);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      disarmGestures();
      if (raf) window.cancelAnimationFrame(raf);
      video.pause();
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
