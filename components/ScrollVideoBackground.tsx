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

const FRAME_SECONDS = 0.1;
const EASE = 0.32;
const SLOW_SEEK_MS = 160;
const SEEK_WATCHDOG_MS = 900;

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

function clampTime(raw: number, duration: number) {
  return Math.min(Math.max(raw, 0), Math.max(duration - 0.001, 0));
}

function snapTime(raw: number, step: number, duration: number) {
  return clampTime(Math.round(raw / step) * step, duration);
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
    let raf = 0;
    let lastApplied = -1;
    let playhead = 0;
    let aim = 0;
    let step = FRAME_SECONDS;
    let seekStartedAt = 0;
    let seekWatchdog = 0;
    let disposed = false;
    const seekDurations: number[] = [];
    const mobile = isCoarsePointer();
    // Mobile eases a bit more gently so catch-up doesn't skip frames.
    const ease = mobile ? 0.22 : EASE;

    const scrollTarget = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      return clampTime(progress * video.duration, video.duration);
    };

    const finishSeek = () => {
      if (seekWatchdog) {
        window.clearTimeout(seekWatchdog);
        seekWatchdog = 0;
      }

      const elapsed = performance.now() - seekStartedAt;
      seeking = false;
      playhead = lastApplied;

      if (elapsed > 0 && Number.isFinite(elapsed)) {
        seekDurations.push(elapsed);
        if (seekDurations.length >= 6) {
          const avg =
            seekDurations.reduce((sum, value) => sum + value, 0) /
            seekDurations.length;
          seekDurations.length = 0;
          if (avg >= SLOW_SEEK_MS) {
            // Cap so we never fall back to very coarse jumps.
            step = Math.min(step * 1.5, mobile ? 0.35 : 0.5);
          }
        }
      }

      // Keep easing toward the latest scroll aim instead of hard-jumping.
      if (Math.abs(aim - playhead) >= step * 0.45) {
        schedule();
      }
    };

    const apply = (time: number) => {
      if (!ready || disposed || document.hidden) return;
      if (Math.abs(time - lastApplied) < step * 0.45) return;

      lastApplied = time;
      seeking = true;
      seekStartedAt = performance.now();

      try {
        video.currentTime = time;
      } catch {
        finishSeek();
        return;
      }

      seekWatchdog = window.setTimeout(finishSeek, SEEK_WATCHDOG_MS);
    };

    const tick = () => {
      raf = 0;
      if (!ready || disposed || document.hidden) return;
      if (seeking) return;

      const diff = aim - playhead;
      if (Math.abs(diff) < step * 0.45) return;

      // Ease toward scroll target — closes the gap gradually (feels smoother).
      let next = playhead + diff * ease;
      if (Math.abs(next - playhead) < step) {
        next = playhead + Math.sign(diff) * step;
      }
      next = snapTime(next, step, video.duration || 0);
      apply(next);
    };

    const schedule = () => {
      if (raf || disposed) return;
      raf = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      aim = scrollTarget();
      schedule();
    };

    const markReady = () => {
      if (ready || disposed) return;
      ready = true;
      video.pause();
      playhead = 0;
      aim = scrollTarget();
      schedule();
    };

    let armed = false;
    let arming = false;

    const disarmGestures = () => {
      window.removeEventListener("touchstart", armDecoder);
      window.removeEventListener("pointerdown", armDecoder);
    };

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
            aim = scrollTarget();
            schedule();
          })
          .catch(() => {
            arming = false;
          });
      } else {
        arming = false;
        video.pause();
        armed = true;
        disarmGestures();
        aim = scrollTarget();
        schedule();
      }
    };

    const onVisibility = () => {
      if (document.hidden) return;
      aim = scrollTarget();
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);

    window.addEventListener("touchstart", armDecoder, { passive: true });
    window.addEventListener("pointerdown", armDecoder, { passive: true });

    if (!mobile) armDecoder();

    return () => {
      disposed = true;
      if (seekWatchdog) window.clearTimeout(seekWatchdog);
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("seeked", finishSeek);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
