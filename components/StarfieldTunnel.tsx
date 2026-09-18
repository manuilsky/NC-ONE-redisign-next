"use client";

import { useEffect, useRef } from "react";
import styles from "./StarfieldTunnel.module.css";

type StarfieldTunnelHandle = {
  dispose: () => void;
};

export function StarfieldTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let handle: StarfieldTunnelHandle | false | null = null;

    void import("@/lib/starfield-tunnel").then(({ initStarfieldTunnel }) => {
      if (cancelled || !canvas.isConnected) return;
      const result = initStarfieldTunnel(canvas);
      if (cancelled) {
        if (result) result.dispose();
        return;
      }
      handle = result;
    });

    return () => {
      cancelled = true;
      if (handle) handle.dispose();
    };
  }, []);

  return (
    <div className={styles.root} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.veil} />
    </div>
  );
}
