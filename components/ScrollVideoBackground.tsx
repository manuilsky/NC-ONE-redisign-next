"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

/** Explicit cover box — iOS Safari often ignores object-fit on <video>. */
function fitCover(
  el: HTMLElement,
  mediaW: number,
  mediaH: number,
  viewportW: number,
  viewportH: number,
) {
  if (mediaW <= 0 || mediaH <= 0 || viewportW <= 0 || viewportH <= 0) return;
  const scale = Math.max(viewportW / mediaW, viewportH / mediaH);
  const w = mediaW * scale;
  const h = mediaH * scale;
  el.style.top = `${(viewportH - h) / 2}px`;
  el.style.left = `${(viewportW - w) / 2}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.minWidth = "0";
  el.style.minHeight = "0";
  el.style.transform = "none";
}

export function ScrollVideoBackground({
  src,
  poster,
}: ScrollVideoBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  /** Video composited under poster (opacity 1) but poster still covers it. */
  const [videoShown, setVideoShown] = useState(false);
  /** True only after decoded data is ready — then poster may hide. */
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (!canUseScrollVideo()) return;
    setUseVideo(true);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !src || !useVideo || !root) return;

    setVideoShown(false);
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
    let phase1 = false;
    let revealedDone = false;
    // Lock cover box so iOS chrome show/hide cannot reflow the video (looks like zoom).
    let coverW = 0;
    let coverH = 0;
    const seekDurations: number[] = [];
    const mobile = isCoarsePointer();
    // Slightly softer ease on phones so slow scrolls don't skip neighboring frames.
    const ease = mobile ? 0.35 : EASE;

    const ensureCoverLock = (allowWidthRetarget = false) => {
      const w = root.clientWidth;
      // Prefer the large shell (lvh / innerHeight) so the first lock is not stuck
      // to a chrome-visible short viewport — that short lock + scroll-down chrome
      // collapse is what left a black gap under the fixed layer on iPhone.
      const h = Math.max(root.clientHeight, window.innerHeight);
      if (!coverW || !coverH) {
        coverW = w;
        coverH = h;
        return;
      }
      // Orientation / real layout change only — ignore chrome height jitter.
      if (allowWidthRetarget && Math.abs(w - coverW) > 40) {
        coverW = w;
        coverH = h;
      }
    };

    const layoutMedia = (allowWidthRetarget = false) => {
      const mw = video.videoWidth;
      const mh = video.videoHeight;
      if (!mw || !mh) return false;
      ensureCoverLock(allowWidthRetarget);
      fitCover(video, mw, mh, coverW, coverH);
      return true;
    };

    const scrollTarget = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return 0;
      return clampTime(scrollProgress() * video.duration, video.duration);
    };

    const endTime = () => clampTime(video.duration || 0, video.duration || 0);

    /** Hide poster only when the video has current decoded data (readyState >= 2). */
    const tryHidePoster = () => {
      if (disposed || revealedDone) return;
      if (video.readyState < 2) return;
      if (!layoutMedia()) return;
      revealedDone = true;
      setRevealed(true);
    };

    const revealIfNeeded = () => {
      if (disposed || revealedDone) return;
      if (!layoutMedia()) return;

      // Phase 1: video under poster; poster stays visible until readyState >= 2.
      if (!phase1) {
        phase1 = true;
        flushSync(() => {
          setVideoShown(true);
        });
      }

      const rvfc = (
        video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;
      if (typeof rvfc === "function" && video.readyState >= 2) {
        rvfc.call(video, () => tryHidePoster());
      }
      tryHidePoster();
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
        // Seeking to the already-current time often skips `seeked` in Chromium.
        if (Math.abs(video.currentTime - time) < step * 0.45) {
          finishSeek();
          return;
        }
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
            layoutMedia();
            aim = scrollTarget();
            lastApplied = -1;
            apply(snapTime(aim, step, video.duration || 0));
            schedule();
            tryHidePoster();
          })
          .catch(() => {
            arming = false;
          });
      } else {
        arming = false;
        video.pause();
        armed = true;
        disarmGestures();
        layoutMedia();
        aim = scrollTarget();
        lastApplied = -1;
        apply(snapTime(aim, step, video.duration || 0));
        schedule();
        tryHidePoster();
      }
    };

    const onScroll = () => {
      // First scroll often unlocks media on iOS Chrome when autoplay arm failed.
      armDecoder();
      aim = scrollTarget();
      schedule();
    };

    const onResize = () => {
      layoutMedia(true);
      aim = scrollTarget();
      schedule();
    };

    const markReady = () => {
      if (ready || disposed) return;
      ready = true;
      video.pause();
      layoutMedia();
      playhead = 0;
      lastApplied = -1;
      aim = scrollTarget();
      // Seek to the current scroll frame before revealing.
      apply(snapTime(aim, step, video.duration || 0));
      schedule();
    };

    const onVisibility = () => {
      if (document.hidden) return;
      layoutMedia();
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

    const onLoadedData = () => {
      layoutMedia();
      tryHidePoster();
    };
    const onCanPlay = () => tryHidePoster();

    if (video.readyState >= 1) markReady();
    else video.addEventListener("loadedmetadata", markReady);

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("seeked", finishSeek);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
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
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("seeked", finishSeek);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      disarmGestures();
      if (raf) window.cancelAnimationFrame(raf);
      video.pause();
    };
  }, [src, useVideo]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.fallback} />
      {poster ? (
        <div
          className={`${styles.poster}${revealed ? ` ${styles.posterGone}` : ""}`}
          style={{ backgroundImage: `url(${JSON.stringify(poster)})` }}
        />
      ) : null}
      {useVideo && src ? (
        <video
          ref={videoRef}
          className={`${styles.video}${videoShown ? "" : ` ${styles.videoPending}`}`}
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
