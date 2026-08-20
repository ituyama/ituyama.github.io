"use client";

import { useEffect, useState } from "react";

type Quote = {
  ok: boolean;
  price?: number;
  change?: number;
  changePercent?: number;
  points?: number[];
  asOf?: number;
};

const UP = "#00e676";
const DOWN = "#ff8a80";

function Turnip() {
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden="true">
      <g fill="#00e676">
        <ellipse cx="24" cy="9" rx="4" ry="8" />
        <ellipse cx="16" cy="12" rx="4" ry="7" transform="rotate(-32 16 12)" />
        <ellipse cx="32" cy="12" rx="4" ry="7" transform="rotate(32 32 12)" />
      </g>
      <path
        d="M24 18c9 0 15 6 15 14 0 7-6 12-15 12S9 39 9 32c0-8 6-14 15-14z"
        fill="#f4fff8"
        stroke="#00e676"
        strokeWidth="1.4"
      />
      <path
        d="M24 44c1 2 1 3 0 4M21 43c-.5 1.5-1 2.5-2 3M27 43c.5 1.5 1 2.5 2 3"
        fill="none"
        stroke="#9fe6b8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const w = 100;
  const h = 34;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * "Turnip price" (カブ価) tile that tracks the real Nikkei 225
 * (日経平均 ÷ 100 → Bells). Data comes from /api/nikkei.
 */
export default function TurnipPrice() {
  const [q, setQ] = useState<Quote | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/nikkei")
      .then((r) => r.json())
      .then((data: Quote) => {
        if (!alive) return;
        if (data.ok) setQ(data);
        else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const up = (q?.change ?? 0) >= 0;
  const color = up ? UP : DOWN;
  const bells = q?.price != null ? Math.round(q.price / 100) : null;

  return (
    <div className="discover-media-fill flex h-full flex-col justify-between p-4 text-white">
      <Turnip />

      {q ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-1.5">
            <span className="text-[clamp(1.5rem,3.8vw,2.2rem)] font-black leading-none tabular-nums">
              {bells?.toLocaleString("ja-JP")}
            </span>
            <span className="mb-0.5 text-[0.78rem] font-bold text-bento-accent">ベル</span>
          </div>
          <div className="inline-flex items-center gap-1 text-[0.78rem] font-bold tabular-nums" style={{ color }}>
            <i className={`bi bi-arrow-${up ? "up" : "down"}-right`} aria-hidden="true" />
            {up ? "+" : ""}
            {q.changePercent?.toFixed(2)}%
          </div>
          <Sparkline points={q.points ?? []} color={color} />
        </div>
      ) : failed ? (
        <span className="text-[0.74rem] font-semibold text-white/70">取得できなかったよ</span>
      ) : (
        <div className="flex flex-col gap-2" aria-hidden="true">
          <div className="h-7 w-2/3 animate-pulse rounded-full bg-white/15" />
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/15" />
        </div>
      )}
    </div>
  );
}
