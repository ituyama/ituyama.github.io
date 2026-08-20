import tickerData from "@/data/ticker.json";

export type TickerItem = {
  symbol: string;
  name: string;
  value: string;
  delta?: string;
  up?: boolean;
};

export type TickerFeed = {
  brand: string;
  liveNikkei: boolean;
  items: TickerItem[];
};

export const ticker: TickerFeed = tickerData;
