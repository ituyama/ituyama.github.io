"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "余白",
  "緩急",
  "本質",
  "残心",
  "疾風",
  "閃光",
  "深層",
  "静寂",
  "覚悟",
  "実装",
  "創造",
  "越境",
  "構築",
  "探求",
  "根源",
  "孤高",
  "余韻",
  "刹那",
  "無限",
  "核心",
  "洗練",
  "柔軟",
  "大胆",
  "突破",
  "前進",
  "調和",
  "循環",
  "到達",
  "創発",
  "革新",
  "奔流",
  "極光",
  "無双",
  "覚醒",
  "頂点",
  "山野",
];

const ROW_COUNT = 9;

/** Hold tickers, then exit. Outer rows leave last. */
const HOLD_MS = 2200;
const ROW_OUT_MS = 980;
const ROW_STAGGER_MS = 70;
const LAST_ROW_DELAY_MS = 4 * ROW_STAGGER_MS;
const DONE_MS = HOLD_MS + LAST_ROW_DELAY_MS + ROW_OUT_MS + 80;

const ROWS = Array.from({ length: ROW_COUNT }, (_, row) => {
  const words = WORDS.filter((_, i) => i % ROW_COUNT === row);
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
