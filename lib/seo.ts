import { hire } from "@/lib/hire";
import { profile } from "@/lib/profile";
import { tags } from "@/lib/tags";
import { work } from "@/lib/work";

export const SITE_URL = "https://ituyama.com";

export const siteTitle = `${profile.nameJa}｜${profile.nameEn}`;

export const siteDescription = [
  `${profile.nameJa}（${profile.nameEn}）のポートフォリオ。`,
  profile.roles.length ? `${profile.roles.join(" / ")}。` : "",
  work.items.length
    ? work.items.map((c) => `${c.name}（${c.role}）`).join("、") + "。"
    : "",
  profile.university ? `${profile.university}。` : "",
  profile.location ? `拠点は${profile.location}。` : "",
]
  .filter(Boolean)
  .join("");

const skillKeywords = tags.items.filter((tag) =>
  /^(LLM|Python|TypeScript|JavaScript|Cloudflare|HTML\/CSS|行政DX)$/i.test(tag),
);

export const siteKeywords = [
  profile.nameJa,
  profile.nameEn,
  "山野",
  "イツキ",
  ...profile.roles,
  ...work.items.map((c) => c.name),
  ...skillKeywords,
  "ポートフォリオ",
  "portfolio",
  "エンジニア",
  "デザイナー",
];

const x = profile.socials.find((s) => s.icon === "twitter-x" || s.name === "X");
export const twitterHandle = x?.handle.replace(/^@/, "") ?? undefined;

const ogImage = {
  url: "/media/ogp.png",
  width: 1200,
  height: 630,
  alt: siteTitle,
};

export const ogImages = [ogImage];

export function jsonLdGraph() {
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const pageId = `${SITE_URL}/#profilepage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: siteTitle,
        inLanguage: "ja",
        description: siteDescription,
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": pageId,
        url: SITE_URL,
        name: siteTitle,
        description: siteDescription,
        inLanguage: "ja",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.nameEn,
        alternateName: [profile.nameJa, "ituyama"],
        familyName: "Yamano",
        givenName: "Itsuki",
        url: SITE_URL,
        image: `${SITE_URL}${profile.avatar}`,
        email: profile.email || undefined,
        description: profile.about || siteDescription,
        jobTitle: work.items[0]?.role,
        worksFor: work.items.map((c) => ({
          "@type": "Organization",
          name: c.name,
          url: c.url || undefined,
        })),
        alumniOf: [
          profile.university
            ? { "@type": "CollegeOrUniversity", name: profile.university }
            : null,
          profile.highSchool
            ? { "@type": "EducationalOrganization", name: profile.highSchool }
            : null,
        ].filter(Boolean),
        address: profile.location
          ? { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "JP" }
          : undefined,
        birthDate: profile.birthday || undefined,
        knowsAbout: tags.items,
        sameAs: [
          ...profile.socials.map((s) => s.url),
          ...profile.links.map((l) => l.url),
          ...work.items.map((c) => c.url).filter(Boolean),
        ],
        contactPoint: profile.email
          ? {
              "@type": "ContactPoint",
              email: profile.email,
              contactType: "inquiries",
              availableLanguage: ["Japanese", "English"],
            }
          : undefined,
      },
    ],
  };
}

export function llmsTxtBody(age: number | null) {
  const lines: string[] = [
    `# ${profile.nameJa} / ${profile.nameEn}`,
    "",
    `> ${profile.tagline || siteDescription}`,
    "",
    `Site: ${SITE_URL}`,
    "",
    "## プロフィール",
  ];

  if (profile.about) lines.push("", profile.about);
  if (age !== null) lines.push(`- 年齢: ${age}歳`);
  if (profile.birthday) lines.push(`- 生年月日: ${profile.birthday}`);
  if (profile.location) lines.push(`- 拠点: ${profile.location}`);
  if (profile.university) lines.push(`- 学歴: ${profile.university}`);
  if (profile.highSchool) lines.push(`- 学歴: ${profile.highSchool}`);
  if (profile.roles.length) lines.push(`- 役割: ${profile.roles.join(" / ")}`);
  if (profile.policy) lines.push("", `方針: ${profile.policy}`);

  if (work.items.length) {
    lines.push("", "## 所属");
    for (const c of work.items) {
      const bits = [`${c.name} — ${c.role}`];
      if (c.summary) bits.push(c.summary);
      if (c.focus?.length) bits.push(`focus: ${c.focus.join(", ")}`);
      if (c.url) bits.push(c.url);
      lines.push(`- ${bits.join(" / ")}`);
    }
  }

  if (hire.openings.length) {
    lines.push("", "## 募集", hire.intro);
    for (const job of hire.openings) {
      lines.push(`- ${job.org} — ${job.role}: ${job.summary}`);
    }
  }

  if (tags.items.length) {
    lines.push("", "## タグ", `- ${tags.items.join(", ")}`);
  }

  lines.push("", "## 連絡先・リンク");
  if (profile.email) lines.push(`- Email: ${profile.email}`);
  for (const s of profile.socials) lines.push(`- ${s.name}: ${s.handle} (${s.url})`);
  for (const l of profile.links) lines.push(`- ${l.label}: ${l.url}`);

  lines.push("");
  return lines.join("\n");
}
