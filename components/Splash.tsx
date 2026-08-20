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

export default function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const timers: number[] = [];
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      if (i >= WORDS.length) {
        timers.push(window.setTimeout(() => {
          if (!cancelled) setPhase("out");
        }, 420));
        timers.push(window.setTimeout(() => {
          if (!cancelled) setPhase("done");
        }, 980));
        return;
      }
      setIndex(i);
      const remaining = WORDS.length - i;
      const delay = remaining <= 4 ? 90 + (5 - remaining) * 70 : 58;
      timers.push(window.setTimeout(tick, delay));
    };

    timers.push(window.setTimeout(tick, 60));

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`pop-splash ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <div className="pop-policy-dots" />
      <p className="pop-splash-word">{WORDS[index]}</p>
    </div>
  );
}
