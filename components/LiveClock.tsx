"use client";

import { useEffect, useState } from "react";

const TZ = "Asia/Tokyo";

function parts(d: Date) {
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
  const date = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TZ,
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(d);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false }).format(d),
  );
  return { time, date, hour };
}

/**
 * Live wall clock in Japan time. Renders nothing meaningful until mounted to
 * avoid a hydration mismatch (server time != client time), then ticks each second.
 */
export default function LiveClock({ invert = false }: { invert?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeClass = invert
    ? "text-white"
    : "text-bento-ink";
  const metaClass = invert ? "text-white/70" : "text-bento-soft";

  if (!now) {
    return (
      <span className={`text-[clamp(1.9rem,5vw,2.8rem)] font-extrabold leading-none tracking-tight tabular-nums ${timeClass}`}>
        --:--:--
      </span>
    );
  }

  const { time, date, hour } = parts(now);
  const isDay = hour >= 6 && hour < 18;

  return (
    <>
      <span className={`flex items-center gap-2 text-[clamp(1.9rem,5vw,2.8rem)] font-extrabold leading-none tracking-tight tabular-nums ${timeClass}`}>
        {time}
        <i
          className={`bi ${isDay ? "bi-sun" : "bi-moon-stars"} text-[0.5em] ${invert ? "text-bento-accent" : "text-bento-muted"}`}
          aria-hidden="true"
        />
      </span>
      <span className={`mt-2 text-[0.78rem] font-medium ${metaClass}`}>
        {date}・JST
      </span>
    </>
  );
}
