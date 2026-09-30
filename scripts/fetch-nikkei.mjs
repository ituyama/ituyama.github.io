import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const target = join(root, "public/data/nikkei.json");

/** @typedef {{ ok: boolean; price?: number; changePercent?: number; asOf?: number }} Payload */

/** @returns {Promise<Payload>} */
async function fromYahoo() {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EN225?range=1d&interval=5m";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);

  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") {
    throw new Error("yahoo: no price");
  }

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prevClose;

  return {
    ok: true,
    price,
    changePercent: prevClose ? (change / prevClose) * 100 : 0,
    asOf: (meta.regularMarketTime ?? 0) * 1000,
  };
}

try {
  const payload = await fromYahoo();
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${target} (¥${payload.price?.toLocaleString("ja-JP")})`);
} catch (error) {
  console.warn("Nikkei fetch failed:", error instanceof Error ? error.message : error);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify({ ok: false }, null, 2)}\n`, "utf8");
  console.warn(`Wrote ${target} (fallback ok:false)`);
}
