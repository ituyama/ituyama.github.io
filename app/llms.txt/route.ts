import { calcAge, profile } from "@/lib/profile";

export const dynamic = "force-static";

/**
 * Serves /llms.txt — an emerging convention that hands LLMs a concise,
 * authoritative markdown summary of the site so they can answer questions
 * about Yamano Itsuki accurately without scraping the JS-rendered UI.
 */
export function GET() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;

  const lines: string[] = [
    `# ${profile.nameJa} / ${profile.nameEn}`,
    "",
    `> ${profile.tagline || `${profile.nameJa} のポートフォリオ`}`,
    "",
    "## プロフィール",
  ];

  if (age !== null) lines.push(`- 年齢: ${age}歳`);
  if (profile.birthday) lines.push(`- 生年月日: ${profile.birthday}`);
  if (profile.location) lines.push(`- 拠点: ${profile.location}`);
  if (profile.university) lines.push(`- 学歴: ${profile.university}`);
  if (profile.highSchool) lines.push(`- 学歴: ${profile.highSchool}`);
  if (profile.car) lines.push(`- 愛車: ${profile.car}`);

  if (profile.companies.length) {
    lines.push("", "## 所属");
    for (const c of profile.companies) lines.push(`- ${c.name} — ${c.role}`);
  }

  if (profile.skills.length) {
    lines.push("", "## スキル", `- ${profile.skills.join(", ")}`);
  }

  lines.push("", "## 連絡先・リンク");
  if (profile.email) lines.push(`- Email: ${profile.email}`);
  for (const s of profile.socials) lines.push(`- ${s.name}: ${s.handle} (${s.url})`);
  for (const l of profile.links) lines.push(`- ${l.label}: ${l.url}`);

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
