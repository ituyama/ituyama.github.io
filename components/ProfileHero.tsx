import { calcAge, profile } from "@/lib/profile";

export default function ProfileHero() {
  const pills = [
    ...profile.companies.map((c) => c.name.replace(/, Inc\.$/, "")),
    ...profile.skills.slice(0, 3),
  ];

  return (
    <section className="pop-kv">
      <div className="pop-cover-stripes" aria-hidden="true" />
      <div className="pop-cover-speed" aria-hidden="true" />
      <p className="pop-cover-mark" aria-hidden="true">
        YAMANO
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profile.avatar} alt={profile.nameJa} className="pop-cover-shot" />

      <div className="pop-cover-copy">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.22em] text-bento-ink">
          {profile.nameEn}
        </p>
        <h1 className="mt-2 font-lineseed text-[clamp(2.8rem,9vw,6.2rem)] font-extrabold leading-[0.88] tracking-tight text-bento-ink">
          {profile.nameJa}
        </h1>
        {profile.tagline ? (
          <p className="mt-3 max-w-sm text-[0.95rem] font-extrabold leading-snug text-bento-ink">
            {profile.tagline}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <span key={p} className="pop-chip">
              {p}
            </span>
          ))}
        </div>
        {profile.email ? (
          <a href={`mailto:${profile.email}`} className="pop-btn mt-5 w-fit">
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            メールする
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function MetricsRow() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const items = [
    { label: "年齢", value: age !== null ? `${age}歳` : "—" },
    { label: "拠点", value: profile.location || "—" },
    { label: "所属", value: `${profile.companies.length}社` },
    { label: "学歴", value: profile.university ? "大卒" : "—" },
    { label: "スキル", value: `${profile.skills.length}` },
  ];

  return (
    <dl className="pop-frame grid grid-cols-2 sm:grid-cols-5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1 px-4 py-3 ${i > 0 ? "border-l border-bento-line" : ""}`}
        >
          <dt className="text-[0.66rem] font-bold text-bento-muted">{item.label}</dt>
          <dd className="m-0 text-[0.92rem] font-extrabold text-bento-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
