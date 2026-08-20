"use client";

import { profile } from "@/lib/profile";

type NavId = "home" | "ask" | "work" | "skills" | "reset";

const NAV: { id: NavId; icon: string; label: string }[] = [
  { id: "home", icon: "compass", label: "ホーム" },
  { id: "ask", icon: "chat-dots", label: "質問" },
  { id: "work", icon: "buildings", label: "仕事" },
  { id: "skills", icon: "list-ul", label: "スキル" },
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
    <>
      <aside className="fixed bottom-0 left-0 right-0 z-30 flex h-[3.6rem] items-center justify-around border-t-[1.5px] border-bento-ink bg-bento-nav px-2 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-10 md:h-[calc(100dvh-2.5rem)] md:w-[72px] md:flex-col md:justify-start md:gap-2 md:border-r-[1.5px] md:border-t-0 md:px-0 md:py-5">
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
                className={`flex size-11 items-center justify-center rounded-full text-[1.2rem] transition-colors ${
                  isActive
                    ? "bg-bento-accent text-bento-ink"
                    : "text-bento-soft hover:bg-white"
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
              className="hidden size-11 items-center justify-center rounded-full text-[1.2rem] text-bento-soft hover:bg-white md:flex"
            >
              <i className="bi bi-github" aria-hidden="true" />
            </a>
          ) : null}

          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              aria-label="メール"
              className="hidden size-11 items-center justify-center rounded-full text-[1.2rem] text-bento-soft hover:bg-white md:flex"
            >
              <i className="bi bi-envelope" aria-hidden="true" />
            </a>
          ) : null}
        </nav>

        <div className="mt-auto hidden flex-col items-center gap-4 md:flex">
          <div className="grid grid-cols-2 gap-1" aria-hidden="true">
            <span className="size-2 rounded-[2px] bg-bento-accent" />
            <span className="size-2 rounded-[2px] bg-bento-ink" />
            <span className="size-2 rounded-[2px] bg-[#1b6a62]" />
            <span className="size-2 rounded-[2px] bg-white ring-1 ring-bento-ink/20" />
          </div>
          <button
            type="button"
            onClick={() => onNavigate("reset")}
            aria-label="もう一度聞く"
            className="flex size-11 items-center justify-center rounded-full text-[1.15rem] text-bento-soft hover:bg-white"
          >
            <i className="bi bi-box-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}
