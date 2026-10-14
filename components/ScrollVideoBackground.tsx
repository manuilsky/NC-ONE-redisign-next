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

// Matches the scrub encode (~24fps, every frame is a keyframe).
const FRAME_SECONDS = 1 / 24;
const EASE = 0.45;
const SLOW_SEEK_MS = 140;
const SEEK_WATCHDOG_MS = 900;
/** Treat as page bottom — mobile chrome/subpixels rarely hit exact maxScroll. */
const SCROLL_END_PX = 3;

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
  if (!duration || !Number.isFinite(duration)) return 0;
  // Leave a tiny epsilon so browsers accept the seek near EOF.
  return Math.min(Math.max(raw, 0), Math.max(duration - 0.05, 0));
}

function snapTime(raw: number, step: number, duration: number) {
  return clampTime(Math.round(raw / step) * step, duration);
}

function scrollProgress() {
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  );
  const y = Math.max(window.scrollY, 0);
  if (y >= maxScroll - SCROLL_END_PX) return 1;
  return Math.min(Math.max(y / maxScroll, 0), 1);
}

export function ScrollVideoBackground({
  src,
  poster,
}: ScrollVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  /** Hide poster only after video has painted the scroll-synced frame. */
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (!canUseScrollVideo()) return;
    setUseVideo(true);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !useVideo) return;

    setRevealed(false);

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
    let painted = false;
    const seekDurations: number[] = [];
    const mobile = isCoarsePointer();
    // Slightly softer ease on phones so slow scrolls don't skip neighboring frames.
    const ease = mobile ? 0.35 : EASE;

    const scrollTarget = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return 0;
      return clampTime(scrollProgress() * video.duration, video.duration);
    };

    const endTime = () => clampTime(video.duration || 0, video.duration || 0);

    const revealIfNeeded = () => {
      if (disposed || painted) return;
      painted = true;
      const paint = () => {
        if (disposed) return;
        setRevealed(true);
      };
      const rvfc = (
        video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;
      if (typeof rvfc === "function") {
        rvfc.call(video, paint);
      } else {
        requestAnimationFrame(() => requestAnimationFrame(paint));
      }
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
            step = Math.min(step * 1.5, mobile ? 0.125 : 0.25);
          }
        }
      }

      revealIfNeeded();

      // Keep easing toward the latest scroll aim instead of hard-jumping.
      if (Math.abs(aim - playhead) >= step * 0.45) {
        schedule();
      }
    };

    const apply = (time: number) => {
      if (!ready || disposed || document.hidden) return;
      if (Math.abs(time - lastApplied) < step * 0.45) {
        // Still count as painted when already on the target frame (e.g. top of page).
        if (lastApplied >= 0) revealIfNeeded();
        return;
      }

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
      if (Math.abs(diff) < step * 0.45) {
        // Force the true last frame once the page is at the bottom.
        if (scrollProgress() >= 1 && playhead < endTime() - step * 0.1) {
          apply(endTime());
        }
        return;
      }

      // Near EOF: skip easing so mobile scrub actually reaches the last frame.
      if (aim >= endTime() - step) {
        apply(endTime());
        return;
      }

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
      lastApplied = -1;
      aim = scrollTarget();
      // Seek to the current scroll frame before revealing over the poster.
      apply(snapTime(aim, step, video.duration || 0));
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
            lastApplied = -1;
            apply(snapTime(aim, step, video.duration || 0));
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
        lastApplied = -1;
        apply(snapTime(aim, step, video.duration || 0));
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

    // Try unlocking immediately; gesture listeners remain as a mobile fallback.
    armDecoder();

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
          className={`${styles.video}${revealed ? ` ${styles.posterGone}` : ""}`}
          src={poster}
          alt=""
          decoding="async"
        />
      ) : null}
      {useVideo && src ? (
        <video
          ref={videoRef}
          className={`${styles.video}${revealed ? "" : ` ${styles.videoPending}`}`}
          src={src}
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
