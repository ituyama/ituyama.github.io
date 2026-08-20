"use client";

import { useEffect, useState } from "react";
import { splash } from "@/lib/splash";

const ROW_COUNT = 9;

/** Hold tickers, then exit. Outer rows leave last. */
const HOLD_MS = 2200;
const ROW_OUT_MS = 1700;
const ROW_STAGGER_MS = 110;
const LAST_ROW_DELAY_MS = 4 * ROW_STAGGER_MS;
const DONE_MS = HOLD_MS + LAST_ROW_DELAY_MS + ROW_OUT_MS + 120;

const ROWS = Array.from({ length: ROW_COUNT }, (_, row) => {
  const words = splash.words.filter((_, i) => i % ROW_COUNT === row);
  const loop = [...words, ...words];
  return [...loop, ...loop];
});

export default function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const out = window.setTimeout(() => setPhase("out"), HOLD_MS);
    const done = window.setTimeout(() => setPhase("done"), DONE_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`pop-splash ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <div className="pop-splash-bg" />
      <div className="pop-policy-dots" />
      <div className="pop-splash-stack">
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
