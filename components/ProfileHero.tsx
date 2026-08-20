import { calcAge, profile } from "@/lib/profile";

export default function ProfileHero() {
  const pills = [
    ...profile.companies.map((c) => c.name.replace(/, Inc\.$/, "")),
    ...profile.skills.slice(0, 3),
  ];

  return (
    <div className="pop-frame">
      <div className="pop-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.nameJa}
          className="absolute bottom-0 right-[6%] h-[135%] w-auto max-w-[min(52%,420px)] object-contain object-bottom"
        />
      </div>

      <div className="flex flex-col gap-4 px-[clamp(1rem,3vw,1.75rem)] py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-lineseed text-[clamp(1.8rem,5vw,2.75rem)] font-extrabold leading-[1.05] tracking-tight text-bento-ink">
            {profile.nameJa}
          </h1>
          <p className="mt-1 text-[0.88rem] font-bold text-bento-soft">{profile.nameEn}</p>
          {profile.tagline ? (
            <p className="mt-2 max-w-xl text-[0.9rem] font-medium text-bento-muted">{profile.tagline}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pills.map((p) => (
              <span key={p} className="pop-chip pop-chip-ghost">
                {p}
              </span>
            ))}
          </div>
        </div>

        {profile.email ? (
          <a href={`mailto:${profile.email}`} className="pop-btn shrink-0">
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            メールする
          </a>
        ) : null}
      </div>

      <MetricsRow />
    </div>
  );
}

function MetricsRow() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const items = [
    { label: "年齢", value: age !== null ? `${age}歳` : "—" },
    { label: "拠点", value: profile.location || "—" },
    { label: "所属", value: `${profile.companies.length}社` },
    { label: "学歴", value: profile.university ? "大卒" : "—" },
    { label: "スキル", value: `${profile.skills.length}` },
  ];

  return (
    <dl className="grid grid-cols-2 border-t-2 border-bento-ink sm:grid-cols-5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1 px-4 py-3 ${i > 0 ? "border-l-2 border-bento-ink/15 sm:border-l-2" : ""}`}
        >
          <dt className="text-[0.66rem] font-bold text-bento-muted">{item.label}</dt>
          <dd className="m-0 text-[0.92rem] font-extrabold text-bento-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
