import { NextResponse } from "next/server";

// Cache the upstream quote for a minute so we are gentle on the free sources.
export const revalidate = 60;

type Payload = {
  ok: boolean;
  price?: number;
  prevClose?: number;
  change?: number;
  changePercent?: number;
  points?: number[];
  asOf?: number;
};

async function fromYahoo(): Promise<Payload> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EN225?range=1d&interval=5m";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") {
    throw new Error("yahoo: no price");
  }
  const price: number = meta.regularMarketPrice;
  const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const closes: number[] = (result?.indicators?.quote?.[0]?.close ?? []).filter(
    (n: unknown): n is number => typeof n === "number",
  );
  const change = price - prevClose;
  return {
    ok: true,
    price,
    prevClose,
    change,
    changePercent: prevClose ? (change / prevClose) * 100 : 0,
    points: closes.length > 1 ? closes : [prevClose, price],
    asOf: (meta.regularMarketTime ?? 0) * 1000,
  };
}

async function fromStooq(): Promise<Payload> {
  const res = await fetch("https://stooq.com/q/l/?s=^nkx&f=sd2t2ohlcv&h&e=csv", {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`stooq ${res.status}`);
  const text = await res.text();
  const line = text.trim().split("\n")[1] ?? "";
  const cols = line.split(",");
  const open = Number(cols[3]);
  const close = Number(cols[6]);
  if (!Number.isFinite(close)) throw new Error("stooq: no close");
  const prevClose = Number.isFinite(open) ? open : close;
  const change = close - prevClose;
  return {
    ok: true,
    price: close,
    prevClose,
    change,
    changePercent: prevClose ? (change / prevClose) * 100 : 0,
    points: [prevClose, close],
  };
}

export async function GET() {
  try {
    return NextResponse.json(await fromYahoo());
  } catch {
    try {
      return NextResponse.json(await fromStooq());
    } catch {
      return NextResponse.json({ ok: false } satisfies Payload);
    }
  }
}
