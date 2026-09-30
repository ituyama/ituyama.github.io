import tickerData from "@/data/ticker.json";

export type TickerFeed = {
  liveNikkei: boolean;
  items: string[];
};

export const ticker: TickerFeed = tickerData;
