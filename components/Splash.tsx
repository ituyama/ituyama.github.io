"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

const HOLD_MS = 1100;
const DONE_MS = 1600;

export default function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const out = window.setTimeout(() => setPhase("out"), HOLD_MS);
    const done = window.setTimeout(() => setPhase("done"), DONE_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`pop-splash ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <p className="pop-splash-name">{profile.nameJa}</p>
    </div>
  );
}
