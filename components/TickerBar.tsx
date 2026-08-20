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
  up?: boolean;
};

function tickerItems(quote: Quote | null): Item[] {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const items: Item[] = [];

  if (quote?.ok && quote.price != null) {
    const up = (quote.changePercent ?? 0) >= 0;
    items.push({
      symbol: "N225",
      name: "日経平均",
      value: `${quote.price.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}円`,
      delta: `${up ? "+" : ""}${(quote.changePercent ?? 0).toFixed(2)}%`,
      up,
    });
  }

  for (const c of profile.companies) {
    items.push({
      symbol: (c.name.split(/[\s,./]+/)[0] ?? c.name).slice(0, 4).toUpperCase(),
      name: c.name.replace(/, Inc\.$/, ""),
      value: c.role,
    });
  }

  if (profile.location) items.push({ symbol: "LOC", name: "拠点", value: profile.location });
  if (age !== null) items.push({ symbol: "AGE", name: "年齢", value: `${age}歳` });

  for (const s of profile.skills) {
    items.push({ symbol: "SKILL", name: "スキル", value: s });
  }

  if (profile.car) items.push({ symbol: "CAR", name: "愛車", value: profile.car });

  for (const social of profile.socials) {
    items.push({
      symbol: social.icon === "github" ? "GH" : "X",
      name: social.name,
      value: social.handle,
    });
  }

  return items;
}

function Row({ items, duplicate }: { items: Item[]; duplicate?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center px-2" aria-hidden={duplicate || undefined}>
      {items.map((item, i) => (
        <li key={`${item.symbol}-${item.value}-${i}`} className="flex shrink-0 items-center">
          <span className="mx-3 h-3.5 w-0.5 bg-bento-ink" aria-hidden="true" />
          <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
            <span className="text-[0.7rem] font-extrabold tracking-[0.1em]">{item.symbol}</span>
            <span className="text-[0.7rem] font-bold">{item.name}</span>
            <span className="text-[0.76rem] font-extrabold tabular-nums">{item.value}</span>
            {item.delta ? (
              <span className="text-[0.7rem] font-extrabold tabular-nums">
                {item.up === false ? "▼" : "▲"}
                {item.delta}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TapeClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  return (
    <div className="hidden h-full shrink-0 items-center gap-1.5 border-l-2 border-bento-ink px-3 text-[0.72rem] font-extrabold tabular-nums sm:flex">
      {time}
      <span className="tracking-[0.08em]">JST</span>
    </div>
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
    <div className="sticky top-0 z-40 flex h-10 overflow-hidden border-b-2 border-bento-ink bg-bento-accent text-bento-ink">
      <div className="relative z-10 flex h-full shrink-0 items-center gap-2 border-r-2 border-bento-ink px-3">
        <span className="ticker-live size-1.5 rounded-full bg-bento-ink" aria-hidden="true" />
        <span className="text-[0.72rem] font-extrabold tracking-[0.14em]">YAMANO</span>
      </div>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex h-full w-max items-center">
          <Row items={items} />
          <Row items={items} duplicate />
        </div>
      </div>
      <TapeClock />
    </div>
  );
}
