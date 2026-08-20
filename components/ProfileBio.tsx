import { profile } from "@/lib/profile";

export default function ProfileBio() {
  const education = [profile.university, profile.highSchool].filter(Boolean);

  return (
    <section className="grid gap-10 md:grid-cols-3 md:gap-8">
      {profile.companies.length ? (
        <div>
          <h2 className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-bento-muted">
            Work
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {profile.companies.map((c) => (
              <li key={c.name}>
                <p className="text-[1.05rem] font-extrabold leading-snug text-bento-ink">{c.name}</p>
                <p className="mt-0.5 text-[0.84rem] font-medium text-bento-soft">{c.role}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {education.length ? (
        <div>
          <h2 className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-bento-muted">
            Education
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {education.map((e) => (
              <li key={e} className="text-[0.95rem] font-semibold leading-snug text-bento-ink">
                {e}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {profile.skills.length ? (
        <div>
          <h2 className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-bento-muted">
            Skills
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-bento-accent px-3 py-1.5 text-[0.78rem] font-bold text-bento-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
