"use client";

import { useEffect, useState } from "react";
import BentoMasonry from "@/components/BentoMasonry";
import BentoSkeleton from "@/components/BentoSkeleton";
import BuildStatus from "@/components/BuildStatus";
import Composer from "@/components/Composer";
import SiteHeader from "@/components/SiteHeader";
import WelcomeModal from "@/components/WelcomeModal";
import type { BentoLayout } from "@/lib/bentoSchema";
import { initialLayout } from "@/lib/profile";

const VISITOR_KEY = "bento.visitor.v1";

export default function Home() {
  const [layout, setLayout] = useState<BentoLayout>(initialLayout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [gateChecked, setGateChecked] = useState(false);

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
    void ask(
      `あなたを訪ねてきたのは「${who}」です。この訪問者の関心に合わせて、最も響くと思われる内容・順序・粒度で山野一樹のポートフォリオを Bento で構成してください。冒頭の intro でひとことだけ歓迎してください。`,
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
  }

  function reopenWelcome() {
    setLayout(initialLayout);
    setError(null);
    setLastPrompt(null);
    setShowWelcome(true);
  }

  const contentReady = gateChecked && !showWelcome;

  if (!contentReady) {
    return showWelcome ? (
      <WelcomeModal onIdentify={handleIdentify} onSkip={handleSkip} />
    ) : null;
  }

  return (
    <>
      <SiteHeader onHome={backToTop} onReset={reopenWelcome} />
      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-5xl flex-col gap-4 px-[clamp(0.75rem,3vw,1.5rem)] pb-6 pt-[clamp(1rem,3vw,1.5rem)]">
      {(layout.intro || lastPrompt) && (
        <div className="min-h-[1.5rem]">
          {lastPrompt ? (
            <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-bento-muted">
              <i className="bi bi-chat-dots" aria-hidden="true" />
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
          className="flex items-center gap-2 rounded-[var(--radius-bento-sm)] border border-rose-200 bg-rose-50 px-3 py-2 text-[0.78rem] font-medium text-rose-700"
        >
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
          {error}
        </div>
      ) : null}

      <div className="relative flex-1">
        {loading ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-8">
            <BuildStatus />
          </div>
        ) : null}
        {loading ? <BentoSkeleton /> : <BentoMasonry tiles={layout.tiles} />}
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-bento-bg via-bento-bg/85 to-transparent backdrop-blur-[3px] [mask-image:linear-gradient(to_top,#000_45%,transparent)] [-webkit-mask-image:linear-gradient(to_top,#000_45%,transparent)] sm:h-40"
      />
      <Composer onSubmit={ask} loading={loading} />
      </main>
    </>
  );
}
