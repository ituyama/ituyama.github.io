"use client";

import { useLayoutEffect } from "react";

const MOBILE = "(max-width: 767px)";

function svhPx() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
  document.documentElement.appendChild(probe);
  const h = Math.round(probe.getBoundingClientRect().height);
  probe.remove();
  return h;
}

function clearLock(kv: HTMLElement) {
  kv.style.removeProperty("height");
  kv.style.removeProperty("min-height");
  kv.style.removeProperty("max-height");
}

function lock(kv: HTMLElement, px: number) {
  const v = `${px}px`;
  kv.style.setProperty("height", v);
  kv.style.setProperty("min-height", v);
  kv.style.setProperty("max-height", v);
}

/**
 * Pin the KV with inline px so 100svh cannot ease when the URL bar hides.
 * Only relock on rotate — never on scroll/resize.
 */
export default function KvHeightLock() {
  useLayoutEffect(() => {
    const kv = document.getElementById("top");
    if (!(kv instanceof HTMLElement)) return;

    const apply = (force: boolean) => {
      if (!window.matchMedia(MOBILE).matches) {
        clearLock(kv);
        return;
      }
      if (!force && kv.style.height) return;
      lock(kv, svhPx());
    };

    apply(true);

    const onOrient = () => {
      window.setTimeout(() => apply(true), 250);
    };
    window.addEventListener("orientationchange", onOrient);
    return () => {
      window.removeEventListener("orientationchange", onOrient);
    };
  }, []);

  return null;
}
