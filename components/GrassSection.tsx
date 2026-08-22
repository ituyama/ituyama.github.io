"use client";

import { useEffect, useState } from "react";

import GrassChart, { type GrassFeed } from "@/components/GrassChart";
import { GRASS_API_PATH } from "@/lib/grass";
import { profile } from "@/lib/profile";

export default function GrassSection() {
  const [feed, setFeed] = useState<GrassFeed | null>(null);
  const github = profile.socials.find((s) => s.icon === "github" || s.name === "GitHub");

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
    <section id="grass" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="grass-title">
      <div className="pop-policy-inner">
        <h2 id="grass-title" className="pop-policy-mark">
          芝
        </h2>
        <div className="pop-grass-sheet pop-frame">
          <GrassChart contributions={feed.contributions} total={feed.total.lastYear} />
          {github ? (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pop-grass-link"
            >
              <i className="bi bi-github" aria-hidden="true" />
              {github.handle}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
