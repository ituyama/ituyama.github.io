"use client";

import { useEffect, useState } from "react";

const STEPS: { icon: string; label: string }[] = [
  { icon: "person-badge", label: "プロフィールを読み込み中" },
  { icon: "sliders", label: "あなたの関心に合わせて調整中" },
  { icon: "grid-1x2", label: "タイルを配置中" },
  { icon: "stars", label: "仕上げています" },
];

export default function BuildStatus() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  const current = STEPS[step];

  return (
    <span className="flex items-center gap-2.5 rounded-full border-[1.5px] border-bento-ink bg-bento-accent py-2 pl-3 pr-4 text-[0.78rem] font-bold text-bento-ink shadow-[var(--shadow-bento-hover)]">
      <span className="relative flex size-5 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-bento-ink/20 border-t-bento-ink" />
      </span>
      <span key={step} className="status-swap flex items-center gap-1.5">
        <i className={`bi bi-${current.icon}`} aria-hidden="true" />
        {current.label}
        <span className="inline-flex w-3 justify-start">
          <Dots />
        </span>
      </span>
    </span>
  );
}

function Dots() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v % 3) + 1), 400);
    return () => window.clearInterval(id);
  }, []);
  return <>{".".repeat(n)}</>;
}
