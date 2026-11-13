"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const DURATION = 6000;

type Size = { width: number; height: number };

function getPieceCount({ width, height }: Size): number {
  return Math.min(400, Math.max(80, Math.round((width * height) / 4000)));
}

function prefersLessWork(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  return Boolean(
    connection?.saveData || connection?.effectiveType === "slow-2g",
  );
}

export default function PageConfetti() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prefersLessWork()) {
      return;
    }

    let stopTimeout: ReturnType<typeof setTimeout> | undefined;
    let idleHandle: number | undefined;
    let delayHandle: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;

    function updateSize() {
      if (frame !== undefined) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    }

    function stop() {
      setActive(false);
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
        frame = undefined;
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        stop();
      }
    }

    function start() {
      updateSize();
      setActive(true);
      window.addEventListener("resize", updateSize);
      document.addEventListener("visibilitychange", onVisibilityChange);
      stopTimeout = setTimeout(stop, DURATION);
    }

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(start, { timeout: 1000 });
    } else {
      delayHandle = setTimeout(start, 200);
    }

    return () => {
      if (idleHandle !== undefined) {
        window.cancelIdleCallback(idleHandle);
      }
      if (delayHandle !== undefined) {
        clearTimeout(delayHandle);
      }
      if (stopTimeout !== undefined) {
        clearTimeout(stopTimeout);
      }
      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!active || size.width === 0) {
    return null;
  }

  return (
    <Confetti
      width={size.width}
      height={size.height}
      numberOfPieces={getPieceCount(size)}
      recycle={false}
    />
  );
}
