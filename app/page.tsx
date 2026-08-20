"use client";

import { useMemo, useState } from "react";
import BentoGrid from "@/components/BentoGrid";
import DiscoverHero, { type Chip } from "@/components/DiscoverHero";
import SideNav from "@/components/SideNav";
import TickerBar from "@/components/TickerBar";
import type { BentoTile } from "@/lib/bentoSchema";
import { initialLayout } from "@/lib/profile";

function haystack(tile: BentoTile) {
  return [tile.title, tile.body, tile.caption, tile.type, tile.href]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesChip(tile: BentoTile, chip: string) {
  if (chip === "all") return true;
  if (chip === "work") {
    return (
      tile.title === "Work" ||
      tile.type === "profile" ||
      tile.type === "link" ||
      tile.type === "activity"
    );
  }
  if (chip === "edu") {
    return tile.title === "Education" || tile.type === "profile";
  }
  if (chip === "skills") {
    return tile.type === "skills" || tile.type === "activity" || tile.type === "code";
  }
  return haystack(tile).includes(chip.toLowerCase());
}

function matchesQuery(tile: BentoTile, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystack(tile).includes(q);
}

export default function Home() {
  const [activeChip, setActiveChip] = useState("all");
  const [query, setQuery] = useState("");

  const tiles = useMemo(
    () => initialLayout.tiles.filter((t) => matchesChip(t, activeChip) && matchesQuery(t, query)),
    [activeChip, query],
  );

  function handleChip(chip: Chip) {
    setActiveChip(chip.id);
    setQuery("");
  }

  function handleNav(id: "home" | "work" | "skills") {
    if (id === "home") {
      setActiveChip("all");
      setQuery("");
      return;
    }
    if (id === "work") {
      handleChip({ id: "work", label: "仕事" });
      return;
    }
    handleChip({ id: "skills", label: "スキル" });
  }

  const navActive = activeChip === "work" ? "work" : activeChip === "all" ? "home" : "skills";

  return (
    <>
      <TickerBar />
      <SideNav active={navActive} onNavigate={handleNav} />
      <main className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-[1280px] flex-col gap-6 px-[clamp(0.85rem,3vw,2rem)] pb-24 pt-6 md:ml-[72px] md:pb-10">
        <DiscoverHero
          query={query}
          activeChip={activeChip}
          onQuery={setQuery}
          onChip={handleChip}
        />

        {tiles.length ? (
          <BentoGrid tiles={tiles} />
        ) : (
          <p className="rounded-[var(--radius-bento)] border-[1.5px] border-bento-ink bg-bento-surface px-5 py-8 text-center text-[0.9rem] font-medium text-bento-muted">
            該当するカードがありません
          </p>
        )}
      </main>
    </>
  );
}
