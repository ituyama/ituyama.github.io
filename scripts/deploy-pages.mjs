import { execSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const branch = "web";

execSync("npm run build", { cwd: root, stdio: "inherit" });

const workDir = mkdtempSync(join(tmpdir(), "ituyama-pages-"));
const repoDir = join(workDir, "repo");

try {
  execSync(`git clone --depth 1 -b ${branch} https://github.com/ituyama/ituyama.github.io.git "${repoDir}"`, {
    stdio: "inherit",
  });

  for (const entry of ["404.html", "CNAME", "_next", "index.html", "index.txt", "llms.txt", "media", "og.html", "og.txt", "robots.txt", "sitemap.xml", ".nojekyll"]) {
    rmSync(join(repoDir, entry), { force: true, recursive: true });
  }

  cpSync(outDir, repoDir, { recursive: true });

  execSync("git add -A", { cwd: repoDir, stdio: "inherit" });
  execSync('git diff --cached --quiet || git commit -m "Deploy GitHub Pages"', {
    cwd: repoDir,
    stdio: "inherit",
  });
  execSync(`git push origin ${branch}`, { cwd: repoDir, stdio: "inherit" });
} finally {
  rmSync(workDir, { force: true, recursive: true });
}

console.log("Deployed to GitHub Pages (web branch).");
