"use client";

import { useEffect, useMemo, useState } from "react";
import { ticker, type TickerItem } from "@/lib/ticker";

type Quote = {
  ok: boolean;
  price?: number;
  changePercent?: number;
};

function withLiveQuote(quote: Quote | null): TickerItem[] {
  const items = [...ticker.items];
  if (!ticker.liveNikkei || !quote?.ok || quote.price == null) return items;

  const up = (quote.changePercent ?? 0) >= 0;
  return [
    {
      symbol: "N225",
      name: "日経平均",
      value: `${quote.price.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}円`,
      delta: `${up ? "+" : ""}${(quote.changePercent ?? 0).toFixed(2)}%`,
      up,
    },
    ...items,
  ];
}

function Row({ items, duplicate }: { items: TickerItem[]; duplicate?: boolean }) {
  return (
    <ul className="flex h-full shrink-0 items-stretch px-2" aria-hidden={duplicate || undefined}>
      {items.map((item, i) => (
        <li key={`${item.symbol}-${item.value}-${i}`} className="flex h-full shrink-0 items-center">
          <span className="mx-3 h-full w-0.5 bg-bento-ink" aria-hidden="true" />
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
    if (!ticker.liveNikkei) return;
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

  const items = useMemo(() => withLiveQuote(quote), [quote]);
  if (items.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 flex h-10 overflow-hidden border-b-2 border-bento-ink bg-bento-accent text-bento-ink">
      <div className="relative z-10 flex h-full shrink-0 items-center gap-2 border-r-2 border-bento-ink px-3">
        <span className="ticker-live size-1.5 rounded-full bg-bento-ink" aria-hidden="true" />
        <span className="text-[0.72rem] font-extrabold tracking-[0.14em]">{ticker.brand}</span>
      </div>
      <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex h-full w-max items-stretch">
          <Row items={items} />
          <Row items={items} duplicate />
        </div>
      </div>
      <TapeClock />
    </div>
  );
}
