import { profile } from "@/lib/profile";

const github = profile.socials.find((s) => s.icon === "github" || s.name === "GitHub");

export default function SideNav() {
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-30 flex h-[3.6rem] items-center justify-around border-t-2 border-bento-line bg-bento-nav px-2 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-10 md:h-[calc(100dvh-2.5rem)] md:w-[72px] md:flex-col md:justify-start md:gap-2 md:border-r-2 md:border-t-0 md:px-0 md:py-5">
      <nav className="flex w-full items-center justify-around md:flex-col md:gap-2 md:pt-1" aria-label="サイト内移動">
        <a
          href="#top"
          aria-label="先頭へ"
          className="flex size-11 items-center justify-center rounded-[10px] bg-bento-accent text-[1.2rem] text-bento-ink"
        >
          <i className="bi bi-compass" aria-hidden="true" />
        </a>

        {github ? (
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-11 items-center justify-center rounded-[10px] text-[1.2rem] text-bento-ink hover:bg-white"
          >
            <i className="bi bi-github" aria-hidden="true" />
          </a>
        ) : null}

        {profile.email ? (
          <a
            href={`mailto:${profile.email}`}
            aria-label="メール"
            className="flex size-11 items-center justify-center rounded-[10px] text-[1.2rem] text-bento-ink hover:bg-white"
          >
            <i className="bi bi-envelope" aria-hidden="true" />
          </a>
        ) : null}
      </nav>

      <div className="mt-auto hidden flex-col items-center gap-4 md:flex" aria-hidden="true">
        <div className="grid grid-cols-2 gap-1">
          <span className="size-2.5 rounded-full bg-[#1b6a62]" />
          <span className="size-2.5 rounded-full bg-[#4d7cff]" />
          <span className="size-2.5 rounded-full bg-bento-accent" />
          <span className="size-2.5 rounded-full bg-[#7a5cff]" />
        </div>
      </div>
    </aside>
  );
}
