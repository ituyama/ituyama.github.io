import type { BentoLayout } from "./bentoSchema";
import profileData from "@/data/profile.json";

export type Social = { name: string; handle: string; url: string; icon: string };
export type ProfileLink = { label: string; url: string; icon: string };
export type Company = { name: string; role: string };
export type Profile = {
  nameJa: string;
  nameEn: string;
  tagline: string;
  avatar: string;
  birthday: string;
  location: string;
  university: string;
  companies: Company[];
  skills: string[];
  email: string;
  activityGraph: string;
  about: string;
  socials: Social[];
  links: ProfileLink[];
};

/**
 * Single source of truth about Yamano Itsuki, loaded from data/profile.json.
 * Injected into the LLM system prompt so generated tiles stay factual, and
 * also used to render the initial (static) Bento layout before any query.
 * Edit the JSON to update the portfolio content.
 */
export const profile: Profile = profileData;

/** Age in full years from an ISO birthday (e.g. "2002-10-03"). */
export function calcAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

/**
 * Compact, factual context handed to the model. Keep it plain so the model
 * does not invent details.
 */
export function profileContext(): string {
  const socials = profile.socials
    .map((s) => `${s.name}: ${s.handle} (${s.url})`)
    .join("\n");
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  return [
    `名前: ${profile.nameJa} / ${profile.nameEn}`,
    profile.birthday ? `生年月日: ${profile.birthday}` : "",
    age !== null ? `年齢: ${age}歳（この値をそのまま使う。再計算しない）` : "",
    profile.tagline ? `キャッチ: ${profile.tagline}` : "",
    profile.about ? `自己紹介: ${profile.about}` : "",
    profile.university ? `学歴: ${profile.university}` : "",
    profile.companies.length
      ? `所属:\n${profile.companies.map((c) => `${c.name} — ${c.role}`).join("\n")}`
      : "",
    profile.location ? `拠点: ${profile.location}` : "",
    profile.skills.length ? `スキル: ${profile.skills.join(", ")}` : "",
    profile.email ? `メール: ${profile.email}` : "",
    profile.activityGraph ? `GitHub草グラフ: ${profile.activityGraph}` : "",
    socials ? `SNS:\n${socials}` : "",
    profile.links.length
      ? `リンク:\n${profile.links.map((l) => `${l.label}: ${l.url}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

type Tile = BentoLayout["tiles"][number];
type Accent = Tile["accent"];

const ACCENT_CYCLE: Accent[] = [
  "rose",
  "sky",
  "amber",
  "mint",
  "peach",
  "cyan",
  "violet",
  "indigo",
];

/**
 * Build the default Bento layout directly from the profile JSON. Tiles are
 * emitted only for fields that actually have data, so editing
 * data/profile.json is enough to change what the homepage renders — the UI is
 * regenerated from the JSON every time, with no hand-written tile list.
 */
export function buildLayout(p: Profile = profile): BentoLayout {
  const tiles: Tile[] = [];
  let a = 0;
  const nextAccent = (): Accent => ACCENT_CYCLE[a++ % ACCENT_CYCLE.length];

  if (p.avatar) {
    tiles.push({
      type: "image",
      title: p.nameEn || p.nameJa || "Portrait",
      body: p.avatar,
      accent: "rose",
      span: 4,
      rowSpan: 2,
    });
  }

  const name = [p.nameJa, p.nameEn].filter(Boolean).join(" / ");
  if (name) {
    const age = p.birthday ? calcAge(p.birthday) : null;
    tiles.push({
      type: "profile",
      title: "Profile",
      body: name,
      caption: p.tagline || (age !== null ? `${age}歳` : undefined),
      accent: nextAccent(),
      span: p.avatar ? 8 : 12,
      rowSpan: 1,
      icon: "person-badge",
    });
  }

  if (p.about) {
    tiles.push({
      type: "text",
      title: "About",
      body: p.about,
      accent: nextAccent(),
      span: 8,
      rowSpan: p.about.length > 80 ? 2 : 1,
      icon: "stars",
    });
  }

  if (p.companies.length) {
    tiles.push({
      type: "text",
      title: "Work",
      body: p.companies.map((c) => `${c.name} — ${c.role}`).join("\n"),
      accent: nextAccent(),
      span: 6,
      rowSpan: p.companies.length > 2 ? 2 : 1,
      icon: "briefcase",
    });
  }

  if (p.university) {
    tiles.push({
      type: "text",
      title: "Education",
      body: p.university,
      accent: nextAccent(),
      span: 6,
      rowSpan: 1,
      icon: "mortarboard",
    });
  }

  if (p.location) {
    tiles.push({
      type: "stat",
      title: "Location",
      body: p.location,
      accent: nextAccent(),
      span: 4,
      rowSpan: 1,
      icon: "geo-alt-fill",
    });
  }

  if (p.skills.length) {
    tiles.push({
      type: "code",
      title: "Skills",
      body: `$ skills\n${p.skills.join(", ")}`,
      accent: nextAccent(),
      span: 6,
      rowSpan: 2,
      icon: "terminal",
    });
  }

  if (p.activityGraph) {
    tiles.push({
      type: "activity",
      title: "GitHub activity",
      body: p.activityGraph,
      accent: nextAccent(),
      span: 6,
      rowSpan: 1,
      icon: "graph-up",
    });
  }

  if (p.email) {
    tiles.push({
      type: "link",
      title: "Contact",
      body: p.email,
      href: `mailto:${p.email}`,
      accent: nextAccent(),
      span: 6,
      rowSpan: 1,
      icon: "envelope-fill",
    });
  }

  for (const s of p.socials) {
    tiles.push({
      type: "link",
      title: s.name,
      body: s.handle,
      href: s.url,
      accent: nextAccent(),
      span: 4,
      rowSpan: 1,
      icon: s.icon,
    });
  }

  for (const l of p.links) {
    tiles.push({
      type: "link",
      title: l.label,
      body: l.url.replace(/^https?:\/\//, ""),
      href: l.url,
      accent: nextAccent(),
      span: 4,
      rowSpan: 1,
      icon: l.icon,
    });
  }

  return {
    intro: "",
    tiles,
  };
}

/** Initial layout, regenerated from the profile JSON. */
export const initialLayout: BentoLayout = buildLayout();
