"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ticker } from "@/lib/ticker";

type Quote = {
  ok: boolean;
  price?: number;
  changePercent?: number;
};

const NIKKEI_PLACEHOLDER = "N225 日経平均 ---,---.--円 ▲+0.00%";

function formatNikkei(quote: Quote): string {
  const up = (quote.changePercent ?? 0) >= 0;
  const price = quote.price!.toLocaleString("ja-JP", { maximumFractionDigits: 2 });
  const delta = `${up ? "+" : ""}${(quote.changePercent ?? 0).toFixed(2)}%`;
  return `N225 日経平均 ${price}円 ${up ? "▲" : "▼"}${delta}`;
}

function withLiveQuote(quote: Quote | null): string[] {
  const items = [...ticker.items];
  if (!ticker.liveNikkei) return items;
  if (quote?.ok && quote.price != null) return [formatNikkei(quote), ...items];
  return [NIKKEI_PLACEHOLDER, ...items];
}

function repeatItems(items: string[], times: number): string[] {
  return Array.from({ length: times }, () => items).flat();
}

function Row({ items, duplicate }: { items: string[]; duplicate?: boolean }) {
  return (
    <ul className="flex h-full shrink-0 items-stretch px-2" aria-hidden={duplicate || undefined}>
      {items.map((value, i) => (
        <li key={i} className="flex h-full shrink-0 items-center">
          <span className="mx-3 h-full w-0.5 bg-bento-ink" aria-hidden="true" />
          <span className="shrink-0 whitespace-nowrap text-[0.76rem] font-extrabold tabular-nums">{value}</span>
        </li>
      ))}
    </ul>
  );
}

function TickerTape({ items }: { items: string[] }) {
  const maskRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    const mask = maskRef.current;
    const measure = measureRef.current;
    if (!mask || !measure) return;

    const syncRepeatCount = () => {
      const viewport = mask.clientWidth;
      const cycle = measure.scrollWidth;
      if (!viewport || !cycle) return;
      setRepeatCount(Math.max(2, Math.ceil(viewport / cycle) + 1));
    };

    syncRepeatCount();
    const observer = new ResizeObserver(syncRepeatCount);
    observer.observe(mask);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [items]);

  const loopItems = useMemo(() => repeatItems(items, repeatCount), [items, repeatCount]);

  return (
    <div ref={maskRef} className="ticker-mask relative min-w-0 flex-1 overflow-hidden">
      <div ref={measureRef} className="pointer-events-none absolute h-0 overflow-hidden opacity-0" aria-hidden="true">
        <Row items={items} />
      </div>
      <div className="ticker-track flex h-full w-max items-stretch">
        <Row items={loopItems} />
        <Row items={loopItems} duplicate />
      </div>
    </div>
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
    fetch("/data/nikkei.json")
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
    <div className="pop-z-chrome sticky top-0 flex h-10 overflow-hidden border-b-2 border-bento-ink bg-bento-accent text-bento-ink">
      <TickerTape items={items} />
      <TapeClock />
    </div>
  );
}
