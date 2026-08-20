import { profile } from "@/lib/profile";

const github = profile.socials.find((s) => s.icon === "github" || s.name === "GitHub");

export default function SideNav() {
  return (
    <aside className="fixed top-10 left-0 z-30 hidden h-[calc(100dvh-2.5rem)] w-[72px] flex-col items-center justify-start gap-2 border-r-2 border-bento-line bg-bento-nav py-5 md:flex">
      <nav className="flex flex-col gap-2 pt-1" aria-label="サイト内移動">
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

      <div className="mt-auto flex flex-col items-center gap-4" aria-hidden="true">
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
