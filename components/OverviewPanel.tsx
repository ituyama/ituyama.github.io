import { calcAge, profile } from "@/lib/profile";

export default function OverviewPanel() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const facts: { label: string; value: string }[] = [
    profile.location ? { label: "所在地", value: profile.location } : null,
    profile.university ? { label: "大学", value: profile.university } : null,
    profile.highSchool ? { label: "高校", value: profile.highSchool } : null,
    profile.car ? { label: "愛車", value: profile.car } : null,
    profile.email ? { label: "メール", value: profile.email } : null,
  ].filter((x): x is { label: string; value: string } => Boolean(x));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="pop-section-title">概要</h2>
        <div className="grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
          <div className="pop-frame p-[clamp(1.1rem,2.4vw,1.6rem)]">
            <p className="text-[0.72rem] font-extrabold text-bento-muted">キャッチ</p>
            <p className="mt-2 text-[1.15rem] font-extrabold leading-snug text-bento-ink">
              {profile.tagline || `${profile.nameJa}のポートフォリオ`}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span key={s} className="pop-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pop-frame p-[clamp(1.1rem,2.4vw,1.6rem)]">
            <p className="font-lineseed text-[clamp(3.2rem,8vw,4.6rem)] font-extrabold leading-none tracking-tight text-bento-accent">
              {age ?? "—"}
            </p>
            <p className="mt-1 text-[0.8rem] font-bold text-bento-muted">歳 · {profile.location}</p>
            <dl className="mt-5 divide-y-2 divide-bento-ink/10">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-3 py-2.5 text-[0.8rem]">
                  <dt className="shrink-0 font-bold text-bento-muted">{f.label}</dt>
                  <dd className="m-0 text-right font-extrabold text-bento-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
