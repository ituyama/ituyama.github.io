"use client";

import { useEffect, useRef, useState } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);

  function leaveWith(action: () => void) {
    setClosing(true);
    window.setTimeout(action, 420);
  }

  const handleIdentify = (who: string) => leaveWith(() => onIdentify(who));
  const handleSkip = () => leaveWith(onSkip);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="あなたについて教えてください"
      data-closing={closing}
      className="intro-overlay fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bento-bg px-5"
    >
      <div className="relative w-full max-w-xl text-left">
        <p
          className="intro-item text-[0.72rem] font-bold uppercase tracking-[0.22em] text-bento-muted"
          style={{ animationDelay: "60ms" }}
        >
          {profile.nameEn} · Portfolio
        </p>

        <h1
          className="intro-item mt-2 font-lineseed text-[clamp(2.8rem,12vw,5.5rem)] font-extrabold leading-[0.86] tracking-tight text-bento-ink"
          style={{ animationDelay: "140ms" }}
        >
          WHO ARE YOU?
        </h1>
        <p
          className="intro-item mt-3 text-[0.9rem] font-medium text-bento-soft"
          style={{ animationDelay: "180ms" }}
        >
          訪問者に合わせて、見せるカードを組み替えます
        </p>

        <div
          className="intro-item mt-7 flex flex-wrap gap-2"
          style={{ animationDelay: "220ms" }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleIdentify(p.label)}
              className="inline-flex items-center gap-2 rounded-full border border-bento-accent bg-bento-surface px-3.5 py-2 text-[0.82rem] font-bold text-bento-ink hover:bg-bento-accent"
            >
              <i className={`bi bi-${p.icon}`} aria-hidden="true" />
              {p.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const who = value.trim();
            if (who) handleIdentify(who);
          }}
          className="intro-item mt-5 flex h-12 max-w-md items-center overflow-hidden rounded-full border-[1.5px] border-bento-ink bg-bento-surface pl-5"
          style={{ animationDelay: "380ms" }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={60}
            aria-label="あなたは誰ですか"
            placeholder="自由に入力（例: デザイナー）"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-bento-ink outline-none placeholder:text-bento-muted sm:text-[0.85rem]"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="決定"
            className="m-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-bento-accent text-bento-ink disabled:cursor-not-allowed disabled:opacity-25"
          >
            <i className="bi bi-search text-[1.05rem]" aria-hidden="true" />
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
