"use client";

import { useMemo, useState } from "react";

import { calcAge, profile } from "@/lib/profile";
import BandSheet from "./BandSheet";
import LiveClock from "./LiveClock";

type Item = {
  name: string;
  kind: "place" | "now" | "edu" | "skills" | "github";
};

export default function LifePanel() {
  const items = useMemo<Item[]>(() => {
    const next: Item[] = [];
    if (profile.location) next.push({ name: "拠点", kind: "place" });
    next.push({ name: "いま", kind: "now" });
    if (profile.university || profile.highSchool) next.push({ name: "学歴", kind: "edu" });
    if (profile.skills.length) next.push({ name: "スキル", kind: "skills" });
    if (profile.activityGraph) next.push({ name: "GitHub", kind: "github" });
    return next;
  }, []);

  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;

  const flush = item.kind === "place" || item.kind === "github";
  const age = profile.birthday ? calcAge(profile.birthday) : null;
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
          {age !== null ? <p className="pop-work-summary mt-4">{age}歳</p> : null}
        </>
      ) : null}

      {item.kind === "edu" ? (
        <>
          <p className="pop-work-role">学歴</p>
          {profile.university ? <p className="pop-work-summary">{profile.university}</p> : null}
          {profile.highSchool ? (
            <p className={profile.university ? "pop-work-summary mt-2" : "pop-work-summary"}>
              {profile.highSchool}
            </p>
          ) : null}
        </>
      ) : null}

      {item.kind === "skills" ? (
        <>
          <p className="pop-work-role">スキル</p>
          <div className="pop-skill-row">
            {profile.skills.map((skill) => (
              <span key={skill} className="pop-chip">
                {skill}
              </span>
            ))}
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
