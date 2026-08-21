import { handleBoard } from "./board";

export type NikkeiPayload = {
  ok: boolean;
  price?: number;
  changePercent?: number;
  asOf?: number;
};

const ALLOWED_ORIGINS = new Set([
  "https://ituyama.com",
  "https://www.ituyama.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
]);

function corsHeaders(origin: string | null, methods = "GET, OPTIONS"): HeadersInit {
  const allow =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://ituyama.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

async function fetchNikkei(): Promise<NikkeiPayload> {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EN225?range=1d&interval=5m";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);

  const json = (await res.json()) as {
    chart?: {
      result?: Array<{
        meta?: {
          regularMarketPrice?: number;
          chartPreviousClose?: number;
          previousClose?: number;
          regularMarketTime?: number;
        };
      }>;
    };
  };

  const meta = json.chart?.result?.[0]?.meta;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const apiMethods = "GET, POST, OPTIONS";
    const headers = corsHeaders(origin, apiMethods);

    if (url.hostname === "www.ituyama.com") {
      url.hostname = "ituyama.com";
      return Response.redirect(url.toString(), 301);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const board = await handleBoard(request, env, url, headers);
    if (board) return board;

    if (url.pathname === "/api/nikkei") {
      const nikkeiHeaders = {
        ...headers,
        "Cache-Control": "public, max-age=60",
      };
      try {
        return Response.json(await fetchNikkei(), { headers: nikkeiHeaders });
      } catch {
        return Response.json({ ok: false } satisfies NikkeiPayload, {
          status: 502,
          headers: nikkeiHeaders,
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}
