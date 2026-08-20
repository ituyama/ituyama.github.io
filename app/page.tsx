"use client";

import { useEffect, useRef, useState } from "react";
import BentoGrid from "@/components/BentoGrid";
import BentoSkeleton from "@/components/BentoSkeleton";
import BuildStatus from "@/components/BuildStatus";
import DiscoverHero, { DISCOVER_CHIPS, type Chip } from "@/components/DiscoverHero";
import SideNav from "@/components/SideNav";
import TickerBar from "@/components/TickerBar";
import WelcomeModal from "@/components/WelcomeModal";
import type { BentoLayout } from "@/lib/bentoSchema";
import { initialLayout } from "@/lib/profile";

const VISITOR_KEY = "bento.visitor.v1";

const CHIP_PROMPTS: Record<string, string> = {
  work: "所属と仕事について見せて",
  edu: "学歴について見せて",
  skills: "スキルを教えて",
};

export default function Home() {
  const [layout, setLayout] = useState<BentoLayout>(initialLayout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [lastRawPrompt, setLastRawPrompt] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [gateChecked, setGateChecked] = useState(false);
  const [activeChip, setActiveChip] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(VISITOR_KEY)) setShowWelcome(true);
    } catch {
      setShowWelcome(true);
    } finally {
      setGateChecked(true);
    }
  }, []);

  async function ask(prompt: string, label?: string) {
    setLoading(true);
    setError(null);
    setLastPrompt(label ?? prompt);
    setLastRawPrompt(prompt);
    try {
      const res = await fetch("/api/bento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as Partial<BentoLayout> & { error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "生成に失敗しました。");
      }
      setLayout({ intro: data.intro ?? "", tiles: data.tiles ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  function rememberVisitor(who: string) {
    try {
      localStorage.setItem(VISITOR_KEY, who);
    } catch {
      // ignore
    }
  }

  function handleIdentify(who: string) {
    rememberVisitor(who);
    setShowWelcome(false);
    setActiveChip("all");
    void ask(
      `あなたを訪ねてきたのは「${who}」です。この訪問者の関心に合わせて、最も響くと思われる内容・順序・粒度で山野イツキのポートフォリオを構成してください。`,
      `${who} として閲覧中`,
    );
  }

  function handleSkip() {
    rememberVisitor("skip");
    setShowWelcome(false);
  }

  function backToTop() {
    setLayout(initialLayout);
    setError(null);
    setLastPrompt(null);
    setLastRawPrompt(null);
    setActiveChip("all");
  }

  function reopenWelcome() {
    setLayout(initialLayout);
    setError(null);
    setLastPrompt(null);
    setLastRawPrompt(null);
    setActiveChip("all");
    setShowWelcome(true);
  }

  function handleChip(chip: Chip) {
    setActiveChip(chip.id);
    if (chip.id === "all") {
      backToTop();
      return;
    }
    const prompt = CHIP_PROMPTS[chip.id] ?? `「${chip.label}」について見せて`;
    void ask(prompt, chip.label);
  }

  function handleSearch(prompt: string) {
    setActiveChip("");
    void ask(prompt);
  }

  function handleNav(id: "home" | "ask" | "work" | "skills" | "reset") {
    if (id === "home") {
      backToTop();
      return;
    }
    if (id === "ask") {
      searchRef.current?.focus();
      return;
    }
    if (id === "reset") {
      reopenWelcome();
      return;
    }
    if (id === "work") {
      handleChip({ id: "work", label: "仕事" });
      return;
    }
    setActiveChip("skills");
    void ask("スキルを教えて", "スキル");
  }

  const skillIds = DISCOVER_CHIPS.filter((c) => !["all", "work", "edu"].includes(c.id)).map((c) => c.id);
  const navActive =
    activeChip === "work"
      ? "work"
      : activeChip === "edu" || activeChip === "skills" || skillIds.includes(activeChip)
        ? "skills"
        : lastPrompt && activeChip !== "all"
          ? "ask"
          : "home";

  const contentReady = gateChecked && !showWelcome;

  if (!contentReady) {
    return showWelcome ? (
      <WelcomeModal onIdentify={handleIdentify} onSkip={handleSkip} />
    ) : null;
  }

  return (
    <>
      <TickerBar />
      <SideNav active={navActive} onNavigate={handleNav} />
      <main className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-[1280px] flex-col gap-6 px-[clamp(0.85rem,3vw,2rem)] pb-24 pt-6 md:ml-[72px] md:pb-10">
        <DiscoverHero
          ref={searchRef}
          loading={loading}
          activeChip={activeChip}
          onSubmit={handleSearch}
          onChip={handleChip}
        />

        {(layout.intro || lastPrompt) && (
          <div className="min-h-[1.25rem]">
            {lastPrompt ? (
              <p className="flex items-center gap-1.5 text-[0.72rem] font-bold text-bento-muted">
                <i className="bi bi-compass" aria-hidden="true" />
                {lastPrompt}
              </p>
            ) : null}
            {layout.intro ? (
              <p className="mt-1 text-[0.9rem] leading-snug text-bento-ink">{layout.intro}</p>
            ) : null}
          </div>
        )}

        {error ? (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-2 rounded-[var(--radius-bento-sm)] border-[1.5px] border-rose-700 bg-rose-50 px-3 py-2 text-[0.78rem] font-bold text-rose-800"
          >
            <i className="bi bi-exclamation-triangle" aria-hidden="true" />
            <span className="min-w-0 flex-1">{error}</span>
            {lastRawPrompt ? (
              <button
                type="button"
                onClick={() => ask(lastRawPrompt, lastPrompt ?? undefined)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-full bg-bento-accent px-3 py-1 font-bold text-bento-ink disabled:opacity-50"
              >
                <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                再試行
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="relative flex-1">
          {loading ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-10">
              <BuildStatus />
            </div>
          ) : null}
          {loading ? <BentoSkeleton /> : <BentoGrid tiles={layout.tiles} />}
        </div>
      </main>
    </>
  );
}
