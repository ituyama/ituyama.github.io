"use client";

import { useEffect, useState } from "react";

import { profile } from "@/lib/profile";

export default function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    const out = window.setTimeout(() => setPhase("out"), 1500);
    const done = window.setTimeout(() => setPhase("done"), 2100);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`pop-splash ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <div className="pop-policy-dots" />
      <p className="pop-splash-mark">LOADING</p>
      <p className="pop-splash-name">{profile.nameJa}</p>
      <div className="pop-splash-bar">
        <span className="pop-splash-bar-fill" />
      </div>
    </div>
  );
}
