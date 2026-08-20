"use client";

import { profile } from "@/lib/profile";

export type Chip = { id: string; label: string };

export const DISCOVER_CHIPS: Chip[] = [
  { id: "all", label: "すべて" },
  { id: "work", label: "仕事" },
  { id: "edu", label: "学歴" },
  { id: "skills", label: "スキル" },
  ...profile.skills.map((s) => ({ id: s, label: s })),
];

export default function DiscoverHero({
  query,
  activeChip,
  onQuery,
  onChip,
}: {
  query: string;
  activeChip: string;
  onQuery: (value: string) => void;
  onChip: (chip: Chip) => void;
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-lineseed text-[clamp(3.4rem,12vw,7.25rem)] font-extrabold leading-[0.82] tracking-tight text-bento-ink">
            YAMANO
          </h1>
          <p className="mt-3 text-[0.84rem] font-medium leading-snug text-bento-soft sm:text-[0.95rem]">
            {profile.nameJa}のポートフォリオ ・ {profile.tagline}
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex h-12 w-full max-w-md shrink-0 items-center overflow-hidden rounded-full border-[1.5px] border-bento-ink bg-bento-surface pl-5 focus-within:shadow-[0_0_0_3px_rgba(0,230,118,0.35)]"
        >
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="名前 ・ スキル ・ なんでも"
            aria-label="カードを絞り込む"
            maxLength={80}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-bento-ink outline-none placeholder:text-bento-muted sm:text-[0.88rem]"
          />
          <span className="m-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-bento-accent text-bento-ink">
            <i className="bi bi-search text-[1.05rem]" aria-hidden="true" />
          </span>
        </form>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DISCOVER_CHIPS.map((chip) => {
          const selected = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onChip(chip)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.78rem] font-bold ${
                selected
                  ? "bg-bento-accent text-bento-ink"
                  : "border border-bento-accent bg-bento-surface text-bento-ink"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
