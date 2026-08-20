import { calcAge, profile } from "@/lib/profile";

export default function ProfileHero() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const facts = [
    age !== null ? `${age}歳` : null,
    profile.location,
    profile.companies[0] ? `${profile.companies[0].name} ${profile.companies[0].role}` : null,
  ].filter(Boolean);

  return (
    <section className="profile-hero relative overflow-hidden text-white">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[clamp(1rem,4vw,2.5rem)] py-5">
        <span className="font-lineseed text-[0.8rem] font-extrabold tracking-[0.22em]">YAMANO</span>
        <nav className="flex items-center gap-1" aria-label="ソーシャル">
          {profile.socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={s.name}
              className="flex size-10 items-center justify-center rounded-full text-[1.05rem] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <i className={`bi bi-${s.icon}`} aria-hidden="true" />
            </a>
          ))}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              aria-label="メール"
              className="flex size-10 items-center justify-center rounded-full text-[1.05rem] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <i className="bi bi-envelope" aria-hidden="true" />
            </a>
          ) : null}
        </nav>
      </header>

      <div className="mx-auto flex min-h-[100svh] max-w-[1120px] flex-col lg:flex-row lg:items-stretch">
        <div className="relative flex min-h-[58svh] flex-1 items-end justify-center pt-16 lg:min-h-[100svh] lg:order-2 lg:items-end lg:justify-end lg:pt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={profile.nameJa}
            className="h-[58svh] w-auto max-w-[min(92vw,420px)] object-contain object-bottom lg:h-[100svh] lg:max-w-[min(48vw,560px)]"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-end px-[clamp(1.15rem,4vw,2.5rem)] pb-12 pt-6 lg:order-1 lg:justify-center lg:pb-20 lg:pt-24">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.22em] text-bento-accent">
            {profile.nameEn}
          </p>
          <h1 className="mt-3 font-lineseed text-[clamp(2.6rem,8vw,5.8rem)] font-extrabold leading-[0.94] tracking-tight">
            {profile.nameJa}
          </h1>
          {profile.tagline ? (
            <p className="mt-5 max-w-md text-[1.02rem] font-medium leading-relaxed text-white/75">
              {profile.tagline}
            </p>
          ) : null}
          {facts.length ? (
            <p className="mt-4 text-[0.84rem] font-medium text-white/55">{facts.join(" ・ ")}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {profile.companies.map((c) => (
              <span
                key={c.name}
                className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[0.75rem] font-bold text-white/90"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
