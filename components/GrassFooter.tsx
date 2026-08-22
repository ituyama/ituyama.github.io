"use client";

import { useEffect, useState } from "react";

import GrassChart from "@/components/GrassChart";
import { GRASS_API_PATH, type GrassFeed } from "@/lib/grass";

export default function GrassFooter() {
  const [feed, setFeed] = useState<GrassFeed | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(GRASS_API_PATH);
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as GrassFeed;
        if (!cancelled) setFeed(data);
      } catch {
        try {
          const res = await fetch("/data/grass.json");
          if (!res.ok) throw new Error(String(res.status));
          const data = (await res.json()) as GrassFeed;
          if (!cancelled) setFeed(data);
        } catch {
          if (!cancelled) setFeed(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!feed?.contributions.length) return null;

  return (
    <div className="pop-grass-footer">
      <GrassChart contributions={feed.contributions} total={feed.total.lastYear} compact />
    </div>
  );
}
