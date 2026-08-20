import type { ReactNode } from "react";

import { calcAge, profile } from "@/lib/profile";

const LIME = "#00e676";
const BLUE = "#4d7cff";
const VIOLET = "#7a5cff";
const MINT = "#ccffe4";

/*
  Hero backdrop: Bauhaus primitives in the site palette. Each shape is its own
  element so CSS can cluster, overlap, and rotate them. Outlines come from
  `.pop-shape *`, so the weight stays even no matter how far a shape is scaled.
*/
const heroShapes: { id: string; viewBox: string; art: ReactNode }[] = [
  {
    id: "disc",
    viewBox: "0 0 100 100",
    art: <circle cx="50" cy="50" r="48" fill={LIME} />,
  },
  {
    id: "quarter",
    viewBox: "0 0 100 100",
    art: <path d="M2 2 L98 2 A96 96 0 0 1 2 98 Z" fill={MINT} />,
  },
  {
    id: "ring",
    viewBox: "0 0 100 100",
    art: (
      <>
        <circle cx="50" cy="50" r="48" fill={BLUE} />
        <circle cx="50" cy="50" r="21" fill="#ffffff" />
      </>
    ),
  },
  {
    id: "arch",
    viewBox: "0 0 100 130",
    art: <path d="M2 128 L2 52 A48 48 0 0 1 98 52 L98 128 Z" fill={VIOLET} />,
  },
  {
    id: "triangle",
    viewBox: "0 0 100 92",
    art: <path d="M50 2 L98 90 L2 90 Z" fill={VIOLET} />,
  },
  {
    id: "capsule",
    viewBox: "0 0 120 56",
    art: <rect x="2" y="2" width="116" height="52" rx="26" fill={BLUE} />,
  },
  {
    id: "diamond",
    viewBox: "0 0 100 100",
    art: <path d="M50 2 L98 50 L50 98 L2 50 Z" fill="#ffffff" />,
  },
  {
    id: "cross",
    viewBox: "0 0 100 100",
    art: (
      <path
        d="M36 2 L64 2 L64 36 L98 36 L98 64 L64 64 L64 98 L36 98 L36 64 L2 64 L2 36 L36 36 Z"
        fill={LIME}
      />
    ),
  },
  {
    id: "dots",
    viewBox: "0 0 100 100",
    art: (
      <>
        {[18, 50, 82].map((cy) =>
          [18, 50, 82].map((cx) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" fill={LIME} />
          )),
        )}
      </>
    ),
  },
  {
    id: "square",
    viewBox: "0 0 100 100",
    art: <rect x="2" y="2" width="96" height="96" rx="8" fill={MINT} />,
  },
  {
    id: "bar",
    viewBox: "0 0 180 20",
    art: <rect x="2" y="2" width="176" height="16" rx="8" fill={LIME} />,
  },
  {
    id: "pip",
    viewBox: "0 0 100 100",
    art: <circle cx="50" cy="50" r="48" fill={LIME} />,
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
            viewBox={shape.viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            {shape.art}
          </svg>
        ))}
      </div>

      <div className="pop-cover-copy">
        <div className="pop-cover-copy-title">
          <div className="pop-cover-copy-cluster" aria-hidden="true">
            <svg className="pop-copy-g pop-copy-g-sq" viewBox="0 0 100 100">
              <rect x="4" y="4" width="92" height="92" rx="8" fill="#ffffff" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="pop-copy-g pop-copy-g-cir" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="pop-copy-g pop-copy-g-sq2" viewBox="0 0 100 100">
              <rect x="4" y="4" width="92" height="92" rx="8" fill="#ccffe4" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="pop-copy-g pop-copy-g-dia" viewBox="0 0 100 100">
              <path d="M50 6 L94 50 L50 94 L6 50 Z" fill="#ffffff" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg className="pop-copy-g pop-copy-g-pip" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#00e676" stroke="#000" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <h1 className="font-lineseed text-[clamp(2.8rem,11vw,4.2rem)] font-extrabold leading-[0.88] tracking-tight text-bento-ink md:text-[clamp(2.6rem,6vw,5rem)]">
            {profile.nameJa}
          </h1>
        </div>
        {profile.tagline ? (
          <p className="pop-cover-copy-rest mt-3 max-w-sm text-[0.95rem] font-extrabold leading-snug text-bento-ink">
            {profile.tagline}
          </p>
        ) : null}
        <div className="pop-cover-copy-rest mt-4 flex flex-wrap justify-center gap-1.5">
          {pills.map((p) => (
            <span key={p} className="pop-chip">
              {p}
            </span>
          ))}
        </div>
        {profile.email ? (
          <a href={`mailto:${profile.email}`} className="pop-cover-copy-rest pop-btn mt-5 w-fit">
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            メールする
          </a>
        ) : null}
      </div>

      <div className="pop-cover-shot-wrap">
        <div className="pop-cover-halo" aria-hidden="true">
          <span className="pop-cover-halo-glow" />
          <svg className="pop-cover-halo-ring" viewBox="0 0 200 200">
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i}>
                <rect
                  x="98.2"
                  y="2"
                  width="3.6"
                  height="98"
                  rx="1.4"
                  fill="#00e676"
                  stroke="#000000"
                  strokeWidth="1.4"
                  transform={`rotate(${i * 30} 100 100)`}
                />
                <rect
                  x="98.6"
                  y="22"
                  width="2.8"
                  height="62"
                  rx="1.2"
                  fill="#7dffb0"
                  stroke="#000000"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 30 + 15} 100 100)`}
                />
              </g>
            ))}
            <circle cx="100" cy="100" r="54" fill="none" stroke="#000000" strokeWidth="7" />
            <circle cx="100" cy="100" r="54" fill="none" stroke="#00e676" strokeWidth="4" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#000000" strokeWidth="6" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#00e676" strokeWidth="3.2" />
            <circle cx="100" cy="100" r="24" fill="#00e676" stroke="#000000" strokeWidth="3" />
          </svg>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.avatar} alt={profile.nameJa} className="pop-cover-shot" />
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
          className={`flex flex-col gap-1 px-4 py-3 ${i > 0 ? "border-l-2 border-bento-line" : ""}`}
        >
          <dt className="text-[0.66rem] font-bold text-bento-muted">{item.label}</dt>
          <dd className="m-0 text-[0.92rem] font-extrabold text-bento-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
