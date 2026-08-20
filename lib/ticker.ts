import tickerData from "@/data/ticker.json";

export type TickerFeed = {
  brand: string;
  liveNikkei: boolean;
  items: string[];
};

export const ticker: TickerFeed = tickerData;
