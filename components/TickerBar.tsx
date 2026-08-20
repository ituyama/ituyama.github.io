"use client";

import { useEffect, useMemo, useState } from "react";
import { calcAge, profile } from "@/lib/profile";

type Quote = {
  ok: boolean;
  price?: number;
  changePercent?: number;
};

type Item = {
  symbol: string;
  name: string;
  value: string;
  delta?: string;
};

function tickerItems(quote: Quote | null): Item[] {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const items: Item[] = [];

  if (quote?.ok && quote.price != null) {
    const up = (quote.changePercent ?? 0) >= 0;
    items.push({
      symbol: "N225",
      name: "日経平均",
      value: quote.price.toLocaleString("ja-JP", { maximumFractionDigits: 2 }),
      delta: `${up ? "+" : ""}${(quote.changePercent ?? 0).toFixed(2)}%`,
    });
  }

  for (const c of profile.companies) {
    items.push({
      symbol: (c.name.split(/[\s,./]+/)[0] ?? c.name).slice(0, 4).toUpperCase(),
      name: c.name,
      value: c.role,
    });
  }

  if (profile.location) items.push({ symbol: "LOC", name: "拠点", value: profile.location });
  if (age !== null) items.push({ symbol: "AGE", name: "年齢", value: `${age}歳` });
  if (profile.skills.length) {
    items.push({ symbol: "SKILL", name: "スキル", value: profile.skills.join(" · ") });
  }
  if (profile.car) items.push({ symbol: "CAR", name: "愛車", value: profile.car });

  return items;
}

function Row({ items, duplicate }: { items: Item[]; duplicate?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-8 px-6" aria-hidden={duplicate || undefined}>
      {items.map((item, i) => (
        <li key={`${item.symbol}-${i}`} className="flex shrink-0 items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-[0.72rem] font-extrabold tracking-[0.08em]">{item.symbol}</span>
          <span className="text-[0.72rem] font-medium">{item.name}</span>
          <span className="text-[0.78rem] font-extrabold tabular-nums">{item.value}</span>
          {item.delta ? (
            <span className="text-[0.72rem] font-extrabold tabular-nums">{item.delta}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function TickerBar() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/nikkei")
      .then((r) => r.json())
      .then((data: Quote) => {
        if (alive && data.ok) setQuote(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => tickerItems(quote), [quote]);
  if (items.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 h-10 overflow-hidden border-b border-white/70 bg-bento-accent text-bento-ink">
      <div className="ticker-track flex w-max items-center">
        <Row items={items} />
        <Row items={items} duplicate />
      </div>
    </div>
  );
}
