"use client";

import { useState } from "react";
import BentoGrid from "@/components/BentoGrid";
import OverviewPanel from "@/components/OverviewPanel";
import ProfileHero from "@/components/ProfileHero";
import SideNav, { type NavId } from "@/components/SideNav";
import TickerBar from "@/components/TickerBar";
import WorkPanel from "@/components/WorkPanel";
import { initialLayout, profile } from "@/lib/profile";

const TABS: { id: NavId; label: string }[] = [
  { id: "overview", label: "概要" },
  { id: "work", label: "仕事" },
  { id: "play", label: "遊び" },
];

export default function Home() {
  const [tab, setTab] = useState<NavId>("overview");

  return (
    <>
      <TickerBar />
      <SideNav active={tab} onNavigate={setTab} />
      <main className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-[1120px] flex-col gap-6 px-[clamp(0.85rem,3vw,1.75rem)] pb-24 pt-5 md:ml-[72px] md:pb-12">
        <ProfileHero />

        <div className="flex gap-5 border-b-2 border-bento-ink/15">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`-mb-[2px] border-b-[3px] pb-2 text-[0.9rem] font-extrabold ${
                tab === t.id
                  ? "border-bento-accent text-bento-ink"
                  : "border-transparent text-bento-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" ? <OverviewPanel /> : null}
        {tab === "work" ? <WorkPanel /> : null}
        {tab === "play" ? (
          <section>
            <h2 className="pop-section-title">遊び</h2>
            <BentoGrid tiles={initialLayout.tiles} />
          </section>
        ) : null}
      </main>
      <footer className="border-t-2 border-bento-ink/10 py-6 text-center text-[0.76rem] font-bold text-bento-muted md:ml-[72px]">
        {profile.nameJa} / {profile.nameEn}
      </footer>
    </>
  );
}
