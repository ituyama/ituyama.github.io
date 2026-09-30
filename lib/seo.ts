import { hire } from "@/lib/hire";
import { jobs } from "@/lib/jobs";
import { profile } from "@/lib/profile";
import { tags } from "@/lib/tags";
import { work } from "@/lib/work";

export const SITE_URL = "https://ituyama.com";

/** Build-time freshness signal for structured data and sitemaps. */
export const siteModified = new Date().toISOString();

export const siteTitle = `${profile.nameJa}｜${profile.nameEn}`;

export const siteDescription = [
  profile.tagline ? `${profile.tagline}。` : "",
  `${profile.nameJa}（${profile.nameEn}）のポートフォリオ。`,
  profile.roles.length ? `${profile.roles.join(" / ")}。` : "",
  work.items.length
    ? work.items.map((c) => `${c.name}（${c.role}）`).join("、") + "。"
    : "",
  profile.university ? `${profile.university}。` : "",
  profile.location ? `拠点は${profile.location}。` : "",
  jobs.openings.length ? "開発・プロダクト案件を受付中。" : "",
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
  "山野イツキ",
  "Yamano Itsuki",
  "ituyama",
  ...profile.roles,
  ...work.items.map((c) => c.name),
  ...skillKeywords,
  "ポートフォリオ",
  "portfolio",
  "エンジニア",
  "デザイナー",
  "起業家",
];

const x = profile.socials.find((s) => s.icon === "twitter-x" || s.name === "X");
const github = profile.socials.find((s) => s.icon === "github" || s.name === "GitHub");
export const twitterHandle = x?.handle.replace(/^@/, "") ?? undefined;

const ogImage = {
  url: "/media/ogp.png",
  width: 1200,
  height: 630,
  alt: `${profile.nameJa}（${profile.nameEn}）のポートフォリオ`,
  type: "image/png",
};

export const ogImages = [ogImage];

function orgSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function faqEntries() {
  const entries = [
    {
      question: `${profile.nameJa}（${profile.nameEn}）とは誰ですか？`,
      answer: profile.about || siteDescription,
    },
    work.items.length
      ? {
          question: `${profile.nameJa}の所属・経歴は？`,
          answer: work.items
            .map((c) => `${c.name}（${c.role}）${c.summary ? ` — ${c.summary}` : ""}`)
            .join(" / "),
        }
      : null,
    jobs.openings[0]?.summary
      ? {
          question: "お仕事の依頼はできますか？",
          answer: jobs.openings[0].summary.replace(/\n/g, " "),
        }
      : null,
  ].filter(Boolean) as { question: string; answer: string }[];

  return entries;
}

export function jsonLdGraph() {
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const pageId = `${SITE_URL}/#profilepage`;
  const breadcrumbId = `${SITE_URL}/#breadcrumb`;
  const faqId = `${SITE_URL}/#faq`;
  const workListId = `${SITE_URL}/#work-list`;
  const skillListId = `${SITE_URL}/#skills`;
  const avatarId = `${SITE_URL}/#avatar`;
  const ogpId = `${SITE_URL}/#ogp`;

  const organizations = work.items.map((company) => {
    const id = `${SITE_URL}/#org-${orgSlug(company.name)}`;
    return {
      "@type": "Organization",
      "@id": id,
      name: company.name,
      url: company.url || undefined,
      description: company.summary || undefined,
    };
  });

  const occupations = work.items.map((company) => ({
    "@type": "Occupation",
    name: company.role,
    occupationalCategory: company.focus?.join(", ") || undefined,
  }));

  const faqs = faqEntries();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: siteTitle,
        alternateName: [profile.nameJa, profile.nameEn, "ituyama", "ituyama.com"],
        inLanguage: "ja-JP",
        description: siteDescription,
        publisher: { "@id": personId },
        copyrightHolder: { "@id": personId },
        image: { "@id": ogpId },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: SITE_URL,
        name: siteTitle,
        description: siteDescription,
        inLanguage: "ja-JP",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        breadcrumb: { "@id": breadcrumbId },
        primaryImageOfPage: { "@id": ogpId },
        thumbnailUrl: `${SITE_URL}${profile.avatar}`,
        dateModified: siteModified,
        significantLink: [
          github?.url,
          x?.url,
          ...work.items.map((c) => c.url).filter(Boolean),
        ].filter(Boolean),
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile-page-type`,
        url: SITE_URL,
        name: siteTitle,
        description: siteDescription,
        inLanguage: "ja-JP",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        dateModified: siteModified,
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.nameJa,
            item: SITE_URL,
          },
        ],
      },
      {
        "@type": "ImageObject",
        "@id": avatarId,
        url: `${SITE_URL}${profile.avatar}`,
        contentUrl: `${SITE_URL}${profile.avatar}`,
        caption: `${profile.nameJa}（${profile.nameEn}）`,
        representativeOfPage: true,
      },
      {
        "@type": "ImageObject",
        "@id": ogpId,
        url: `${SITE_URL}${ogImage.url}`,
        contentUrl: `${SITE_URL}${ogImage.url}`,
        width: ogImage.width,
        height: ogImage.height,
        caption: siteTitle,
      },
      ...organizations,
      {
        "@type": "Person",
        "@id": personId,
        name: profile.nameEn,
        alternateName: [profile.nameJa, "ituyama", "山野", "イツキ"],
        familyName: "Yamano",
        givenName: "Itsuki",
        url: SITE_URL,
        mainEntityOfPage: { "@id": pageId },
        image: { "@id": avatarId },
        email: profile.email || undefined,
        description: profile.about || siteDescription,
        jobTitle: profile.roles,
        hasOccupation: occupations.length ? occupations : undefined,
        worksFor: organizations.map((org) => ({ "@id": org["@id"] })),
        alumniOf: [
          profile.university
            ? { "@type": "CollegeOrUniversity", name: profile.university }
            : null,
          profile.highSchool
            ? { "@type": "EducationalOrganization", name: profile.highSchool }
            : null,
        ].filter(Boolean),
        nationality: { "@type": "Country", name: "Japan" },
        homeLocation: profile.location
          ? {
              "@type": "Place",
              name: profile.location,
              address: {
                "@type": "PostalAddress",
                addressCountry: "JP",
                addressLocality: profile.location,
              },
            }
          : undefined,
        birthDate: profile.birthday || undefined,
        knowsAbout: tags.items,
        identifier: github
          ? [{ "@type": "PropertyValue", propertyID: "GitHub", value: github.handle.replace(/^@/, "") }]
          : undefined,
        sameAs: [
          ...profile.socials.map((s) => s.url),
          ...profile.links.map((l) => l.url),
          ...work.items.map((c) => c.url).filter(Boolean),
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${SITE_URL}/#jobs`,
          availableLanguage: ["Japanese", "English"],
        },
      },
      {
        "@type": "ItemList",
        "@id": workListId,
        name: "所属・経歴",
        itemListElement: work.items.map((company, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: company.name,
          item: {
            "@type": "Organization",
            name: company.name,
            url: company.url || undefined,
            description: [company.role, company.summary].filter(Boolean).join(" — ") || undefined,
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": skillListId,
        name: "スキル・タグ",
        itemListElement: tags.items.map((tag, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tag,
        })),
      },
      faqs.length
        ? {
            "@type": "FAQPage",
            "@id": faqId,
            mainEntity: faqs.map((entry) => ({
              "@type": "Question",
              name: entry.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: entry.answer,
              },
            })),
          }
        : null,
    ].filter(Boolean),
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

  if (jobs.openings.length) {
    lines.push("", `## ${jobs.title}`, jobs.intro);
    for (const job of jobs.openings) {
      lines.push(`- ${job.org} — ${job.role}: ${job.summary}`);
    }
  }

  if (hire.openings.length) {
    lines.push("", `## ${hire.title}`, hire.intro);
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
