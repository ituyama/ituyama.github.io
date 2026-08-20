"use client";

import { useMemo, useState } from "react";

import { profile } from "@/lib/profile";
import BandSheet from "./BandSheet";
import LiveClock from "./LiveClock";

type Item = {
  name: string;
  kind: "place" | "now" | "github";
};

export default function LifePanel() {
  const items = useMemo<Item[]>(() => {
    const next: Item[] = [];
    if (profile.location) next.push({ name: "拠点", kind: "place" });
    next.push({ name: "いま", kind: "now" });
    if (profile.activityGraph) next.push({ name: "GitHub", kind: "github" });
    return next;
  }, []);

  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;

  const flush = item.kind === "place" || item.kind === "github";
  const mapSrc = profile.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(profile.location)}&z=15&output=embed`
    : "";

  return (
    <BandSheet
      id="life"
      title="LIFE"
      label="暮らし"
      tone="lime"
      tabs={items.map((x) => x.name)}
      active={active}
      onChange={setActive}
      flush={flush}
    >
      {item.kind === "place" ? (
        <>
          <div className="pop-work-stage">
            <iframe
              title={`${profile.location} の地図`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">いまここ</p>
            <p className="pop-work-summary">{profile.location}</p>
          </div>
        </>
      ) : null}

      {item.kind === "now" ? (
        <>
          <p className="pop-work-role">Japan Standard Time</p>
          <div className="mt-3">
            <LiveClock />
          </div>
        </>
      ) : null}

      {item.kind === "github" ? (
        <>
          <div className="pop-work-stage is-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.activityGraph}
              alt="GitHub の草"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">Activity</p>
            <p className="pop-work-summary">ituyama</p>
          </div>
        </>
      ) : null}
    </BandSheet>
  );
}
