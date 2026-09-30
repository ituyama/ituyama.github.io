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
    const animations: Animation[] = [];
    let fallbackId = 0;

    const finish = () => {
      if (!cancelled) setPhase("done");
    };

    const raf = requestAnimationFrame(() => {
      if (cancelled) return;

      const rows = stack.querySelectorAll<HTMLElement>(".pop-splash-row");

      rows.forEach((row, index) => {
        const track = row.querySelector<HTMLElement>(".pop-splash-track");
        if (!track) return;

        const trackWidth = track.scrollWidth;
        const currentX = new DOMMatrix(getComputedStyle(track).transform).m41;
        const rtl = row.classList.contains("is-rtl");
        const targetX = exitTargetX(currentX, trackWidth, rtl);

        track.style.animation = "none";
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;

        animations.push(
          track.animate(
            [
              { transform: `translate3d(${currentX}px, 0, 0)` },
              { transform: `translate3d(${targetX}px, 0, 0)` },
            ],
            {
              duration: ROW_OUT_MS,
              delay: rowExitDelay(index),
              easing: "cubic-bezier(0.22, 0, 0.08, 1)",
              fill: "forwards",
            },
          ),
        );
      });

      Promise.all(animations.map((a) => a.finished)).then(finish).catch(finish);
      fallbackId = window.setTimeout(finish, LAST_ROW_DELAY_MS + ROW_OUT_MS + 400);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fallbackId);
      animations.forEach((a) => a.cancel());
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
