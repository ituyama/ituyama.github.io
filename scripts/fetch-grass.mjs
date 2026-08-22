import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const target = join(root, "public/data/grass.json");
const username = "ituyama";

/** @typedef {{ total: { lastYear: number }; contributions: Array<{ date: string; count: number; level: number }> }} GrassFeed */

/** @returns {Promise<GrassFeed>} */
async function fromGitHub() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!res.ok) throw new Error(`grass ${res.status}`);
  return res.json();
}

try {
  const payload = await fromGitHub();
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${target} (${payload.total.lastYear} contributions)`);
} catch (error) {
  console.warn("Grass fetch failed:", error instanceof Error ? error.message : error);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    `${JSON.stringify({ total: { lastYear: 0 }, contributions: [] }, null, 2)}\n`,
    "utf8",
  );
  console.warn(`Wrote ${target} (fallback empty)`);
}
