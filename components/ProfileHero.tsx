import { calcAge, profile } from "@/lib/profile";

/*
  Each hero shape is its own element so it can be placed and sized on its own.
  `box` is the path's tight bounding box, which keeps the SVG free of dead space.
*/
const heroShapes = [
  {
    id: "lime",
    box: "0 1050 1095 962",
    fill: "#00e676",
    d: "M1095 1323C1095 1588.65 943.149 2012 677.5 2012C411.851 2012 0 1925.65 0 1660C0 1394.35 411.851 1050 677.5 1050C943.149 1050 1095 1057.35 1095 1323Z",
  },
  {
    id: "blue",
    box: "3188.5 0 809 962",
    fill: "#4d7cff",
    d: "M3912.5 511.5C3912.5 777.149 4131.65 962 3866 962C3600.35 962 3188.5 875.649 3188.5 610C3188.5 344.351 3600.35 0 3866 0C4131.65 0 3912.5 245.851 3912.5 511.5Z",
  },
  {
    id: "violet",
    box: "2133.5 1531 816 962",
    fill: "#7a5cff",
    d: "M2949.5 1804C2949.5 2069.65 2797.65 2493 2532 2493C2266.35 2493 2133.5 2436.15 2133.5 2170.5C2133.5 1904.85 2266.35 1531 2532 1531C2797.65 1531 2949.5 1538.35 2949.5 1804Z",
  },
  {
    id: "white",
    box: "1580.5 718.6 1095 704.2",
    fill: "#ffffff",
    d: "M2675.5 1006C2675.5 1271.65 2507.65 1126 2242 1126C1976.35 1126 1580.5 1608.65 1580.5 1343C1580.5 1077.35 2068.5 778.001 2258 733.001C2447.5 688 2675.5 740.352 2675.5 1006Z",
  },
  {
    id: "mint",
    box: "3188.5 1102.4 1095 651.9",
    fill: "#ccffe4",
    d: "M4283.5 1337.4C4283.5 1603.05 4115.65 1457.4 3850 1457.4C3584.35 1457.4 3188.5 1940.05 3188.5 1674.4C3188.5 1408.75 3263.5 1172 3453 1127C3642.5 1082 4283.5 1071.75 4283.5 1337.4Z",
  },
];

export default function ProfileHero() {
  const pills = [
    ...profile.companies.map((c) => c.name.replace(/, Inc\.$/, "")),
    ...profile.skills.slice(0, 3),
  ];

  return (
    <section className="pop-kv">
      <div className="pop-cover-shapes" aria-hidden="true">
        {heroShapes.map((shape) => (
          <svg
            key={shape.id}
            className={`pop-shape pop-shape-${shape.id}`}
            viewBox={shape.box}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={shape.d}
              fill={shape.fill}
              stroke="#000000"
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>

      <div className="pop-cover-copy">
        <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.22em] text-bento-ink">
          {profile.nameEn}
        </p>
        <h1 className="mt-2 font-lineseed text-[clamp(2.8rem,11vw,4.2rem)] font-extrabold leading-[0.88] tracking-tight text-bento-ink md:text-[clamp(2.6rem,6vw,5rem)]">
          {profile.nameJa}
        </h1>
        {profile.tagline ? (
          <p className="mt-3 max-w-sm text-[0.95rem] font-extrabold leading-snug text-bento-ink">
            {profile.tagline}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profile.avatar} alt={profile.nameJa} className="pop-cover-shot" />
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
          className={`flex flex-col gap-1 px-4 py-3 ${i > 0 ? "border-l-2 border-bento-line" : ""}`}
        >
          <dt className="text-[0.66rem] font-bold text-bento-muted">{item.label}</dt>
          <dd className="m-0 text-[0.92rem] font-extrabold text-bento-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
