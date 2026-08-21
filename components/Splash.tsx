"use client";

import { useEffect, useRef, useState } from "react";
import { splash } from "@/lib/splash";

const ROW_COUNT = 9;
const CENTER_ROW = Math.floor(ROW_COUNT / 2);

/** Hold tickers, then exit. Outer rows leave last. */
const HOLD_MS = 2200;
const ROW_OUT_MS = 2200;
const ROW_STAGGER_MS = 110;
const LAST_ROW_DELAY_MS = 4 * ROW_STAGGER_MS;

const ROWS = Array.from({ length: ROW_COUNT }, (_, row) => {
  const word = splash.phrase[row % splash.phrase.length] ?? "";
  const loop = Array(6).fill(word);
  return [...loop, ...loop];
});

function rowExitDelay(index: number): number {
  return Math.abs(index - CENTER_ROW) * ROW_STAGGER_MS;
}

function exitTargetX(currentX: number, trackWidth: number, rtl: boolean): number {
  const viewport = window.innerWidth;
  return rtl ? currentX + viewport + trackWidth : currentX - viewport - trackWidth;
}

function snapX(value: number): number {
  return Math.round(value * 2) / 2;
}

export default function Splash() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const out = window.setTimeout(() => setPhase("out"), HOLD_MS);
    return () => window.clearTimeout(out);
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const stack = stackRef.current;
    if (!stack) return;

    let cancelled = false;
    let fallbackId = 0;
    let pending = 0;

    const finish = () => {
      if (!cancelled) setPhase("done");
    };

    const onTrackExitEnd = (event: AnimationEvent) => {
      if (event.animationName !== "splashTrackExit") return;
      pending -= 1;
      if (pending === 0) finish();
    };

    const raf = requestAnimationFrame(() => {
      if (cancelled) return;

      const rows = stack.querySelectorAll<HTMLElement>(".pop-splash-row");

      rows.forEach((row, index) => {
        const track = row.querySelector<HTMLElement>(".pop-splash-track");
        if (!track) return;

        const trackWidth = track.scrollWidth;
        const currentX = snapX(new DOMMatrix(getComputedStyle(track).transform).m41);
        const rtl = row.classList.contains("is-rtl");
        const targetX = snapX(exitTargetX(currentX, trackWidth, rtl));
        const delay = rowExitDelay(index);

        track.style.setProperty("--splash-x-from", `${currentX}px`);
        track.style.setProperty("--splash-x-to", `${targetX}px`);
        track.style.setProperty("--splash-exit-ms", `${ROW_OUT_MS}ms`);
        track.style.setProperty("--splash-exit-delay", `${delay}ms`);
        track.addEventListener("animationend", onTrackExitEnd);
        track.classList.add("is-exiting");
        pending += 1;
      });

      if (pending === 0) finish();
      fallbackId = window.setTimeout(finish, LAST_ROW_DELAY_MS + ROW_OUT_MS + 400);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fallbackId);
      stack.querySelectorAll<HTMLElement>(".pop-splash-track").forEach((track) => {
        track.removeEventListener("animationend", onTrackExitEnd);
      });
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`pop-splash ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <div className="pop-splash-bg" />
      <div className="pop-policy-dots" />
      <div ref={stackRef} className="pop-splash-stack">
        {ROWS.map((words, i) => (
          <div key={i} className={`pop-splash-row ${i % 2 ? "is-rtl" : "is-ltr"}`}>
            <div className="pop-splash-track">
              {words.map((word, j) => (
                <span key={`${word}-${j}`} className="pop-splash-item">
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
