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

/**
 * Freeze the KV to the first 100svh in px.
 * Do not read visualViewport — that tracks the URL bar and moves the name.
 */
export default function KvHeightLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    let width = window.innerWidth;

    const apply = (reason: "init" | "resize" | "orient") => {
      const mobile = window.matchMedia(MOBILE).matches;
      if (!mobile) {
        root.style.removeProperty("--kv-h");
        width = window.innerWidth;
        return;
      }
      if (reason === "resize" && Math.abs(window.innerWidth - width) < 2) return;
      if (reason === "init" && root.style.getPropertyValue("--kv-h")) {
        width = window.innerWidth;
        return;
      }
      width = window.innerWidth;
      root.style.setProperty("--kv-h", `${svhPx()}px`);
    };

    apply("init");

    const onResize = () => apply("resize");
    const onOrient = () => {
      window.setTimeout(() => apply("orient"), 250);
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
