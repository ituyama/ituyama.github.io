"use client";

import { useEffect } from "react";

const MOBILE = "(max-width: 767px)";

function viewportHeight() {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

/**
 * Freeze the KV to the first mobile viewport height.
 * iOS/Android URL bars change svh/dvh on scroll; we ignore that and only
 * relock on orientation / width changes.
 */
export default function KvHeightLock() {
  useEffect(() => {
    const root = document.documentElement;
    let width = window.innerWidth;

    const apply = (force: boolean) => {
      const mobile = window.matchMedia(MOBILE).matches;
      if (!mobile) {
        root.style.removeProperty("--kv-h");
        width = window.innerWidth;
        return;
      }
      if (!force && Math.abs(window.innerWidth - width) < 2) return;
      width = window.innerWidth;
      root.style.setProperty("--kv-h", `${viewportHeight()}px`);
    };

    apply(true);

    const onResize = () => apply(false);
    const onOrient = () => {
      window.setTimeout(() => apply(true), 250);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrient);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
      root.style.removeProperty("--kv-h");
    };
  }, []);

  return null;
}
