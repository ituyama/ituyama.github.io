"use client";

import { profile } from "@/lib/profile";

export type NavId = "overview" | "work" | "play";

const NAV: { id: NavId; icon: string; label: string }[] = [
  { id: "overview", icon: "compass", label: "概要" },
  { id: "work", icon: "buildings", label: "仕事" },
  { id: "play", icon: "stars", label: "遊び" },
];

const github = profile.socials.find((s) => s.icon === "github" || s.name === "GitHub");

export default function SideNav({
  active,
  onNavigate,
}: {
  active: NavId;
  onNavigate: (id: NavId) => void;
}) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-30 flex h-[3.6rem] items-center justify-around border-t border-bento-line bg-bento-nav px-2 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-10 md:h-[calc(100dvh-2.5rem)] md:w-[72px] md:flex-col md:justify-start md:gap-2 md:border-r md:border-t-0 md:px-0 md:py-5">
      <nav className="flex w-full items-center justify-around md:flex-col md:gap-2 md:pt-1" aria-label="サイト内移動">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`flex size-11 items-center justify-center rounded-[10px] text-[1.2rem] ${
                isActive ? "bg-bento-accent text-bento-ink" : "text-bento-ink hover:bg-white"
              }`}
            >
              <i className={`bi bi-${item.icon}`} aria-hidden="true" />
            </button>
          );
        })}

        {github ? (
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden size-11 items-center justify-center rounded-[10px] text-[1.2rem] text-bento-ink hover:bg-white md:flex"
          >
            <i className="bi bi-github" aria-hidden="true" />
          </a>
        ) : null}

        {profile.email ? (
          <a
            href={`mailto:${profile.email}`}
            aria-label="メール"
            className="hidden size-11 items-center justify-center rounded-[10px] text-[1.2rem] text-bento-ink hover:bg-white md:flex"
          >
            <i className="bi bi-envelope" aria-hidden="true" />
          </a>
        ) : null}
      </nav>

      <div className="mt-auto hidden flex-col items-center gap-4 md:flex" aria-hidden="true">
        <div className="grid grid-cols-2 gap-1">
          <span className="size-2.5 rounded-full bg-bento-accent" />
          <span className="size-2.5 rounded-full bg-[#4d7cff]" />
          <span className="size-2.5 rounded-full bg-[#7a5cff]" />
          <span className="size-2.5 rounded-full bg-[#111111]" />
        </div>
      </div>
    </aside>
  );
}
