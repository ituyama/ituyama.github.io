"use client";

import { useState } from "react";
import { profile } from "@/lib/profile";

const PRESETS: { label: string; icon: string }[] = [
  { label: "採用担当の方", icon: "briefcase" },
  { label: "エンジニア", icon: "code-slash" },
  { label: "学生・研究者", icon: "mortarboard" },
  { label: "友人・知人", icon: "people" },
  { label: "ただ見に来た", icon: "eye" },
];

export default function WelcomeModal({
  onIdentify,
  onSkip,
}: {
  onIdentify: (who: string) => void;
  onSkip: () => void;
}) {
  const [value, setValue] = useState("");
  const [closing, setClosing] = useState(false);

  // Play the exit animation, then hand control back to the page.
  function leaveWith(action: () => void) {
    setClosing(true);
    window.setTimeout(action, 420);
  }

  const handleIdentify = (who: string) => leaveWith(() => onIdentify(who));
  const handleSkip = () => leaveWith(onSkip);

  return (
    <div
      data-closing={closing}
      className="intro-overlay fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bento-bg px-5"
    >
      <div className="relative w-full max-w-lg text-center">
        <p
          className="intro-item text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-bento-muted"
          style={{ animationDelay: "60ms" }}
        >
          {profile.nameEn} · Portfolio
        </p>

        <h1
          className="intro-item mt-3 text-[clamp(1.9rem,7vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-bento-ink"
          style={{ animationDelay: "140ms" }}
        >
          Who are you?
        </h1>

        <div
          className="intro-item mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
          style={{ animationDelay: "220ms" }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleIdentify(p.label)}
              className="flex flex-col items-start gap-3 rounded-[var(--radius-bento-sm)] border border-bento-line bg-bento-surface p-4 text-left"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border border-bento-line bg-bento-panel text-[1.1rem] text-bento-soft">
                <i className={`bi bi-${p.icon}`} aria-hidden="true" />
              </span>
              <span className="text-[0.86rem] font-semibold text-bento-ink">{p.label}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const who = value.trim();
            if (who) handleIdentify(who);
          }}
          className="intro-item mx-auto mt-4 flex max-w-md items-center gap-2 rounded-full border border-bento-line bg-bento-surface p-1.5 pl-4 focus-within:border-bento-line-strong"
          style={{ animationDelay: "380ms" }}
        >
          <i className="bi bi-pencil text-[0.9rem] text-bento-muted" aria-hidden="true" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={60}
            placeholder="自由に入力(例: デザイナー、〇〇社の人)"
            className="min-w-0 flex-1 bg-transparent text-[0.85rem] text-bento-ink outline-none placeholder:text-bento-muted"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="決定"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bento-ink text-white disabled:cursor-not-allowed disabled:opacity-25"
          >
            <i className="bi bi-arrow-right text-[0.95rem]" aria-hidden="true" />
          </button>
        </form>

        <button
          type="button"
          onClick={handleSkip}
          className="intro-item mt-5 text-[0.76rem] font-medium text-bento-muted"
          style={{ animationDelay: "460ms" }}
        >
          スキップして見る
        </button>
      </div>
    </div>
  );
}
