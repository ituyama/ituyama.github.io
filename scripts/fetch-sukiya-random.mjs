import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const dest = join(root, "public/SukiyaRandom");
const repo = "https://github.com/ituyama/SukiyaRandom.git";

const skipTopLevel = new Set([
  ".git",
  ".github",
  ".gitignore",
  "biome.json",
  "bun.lock",
  "lefthook.yml",
  "package.json",
  ".DS_Store",
]);

const workDir = mkdtempSync(join(tmpdir(), "sukiya-random-"));
const repoDir = join(workDir, "repo");

try {
  execSync(`git clone --depth 1 ${repo} "${repoDir}"`, { stdio: "inherit" });
  rmSync(dest, { force: true, recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
  cpSync(repoDir, dest, {
    recursive: true,
    filter: (src) => {
      const rel = src.slice(repoDir.length + 1);
      if (!rel) return true;
      const top = rel.split(/[/\\]/)[0];
      return !skipTopLevel.has(top);
    },
  });
  console.log(`Wrote ${dest}`);
} catch (error) {
  console.warn("SukiyaRandom fetch failed:", error instanceof Error ? error.message : error);
  if (existsSync(join(dest, "index.html"))) {
    console.warn(`Keeping existing ${dest}`);
  } else {
    console.warn("SukiyaRandom is unavailable until fetch succeeds");
  }
} finally {
  rmSync(workDir, { force: true, recursive: true });
}
