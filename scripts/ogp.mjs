import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const target = join(root, "public/media/ogp.png");
const port = 4173;
const url = `http://127.0.0.1:${port}/og.html`;

const ogHtml = join(outDir, "og.html");
const ogIndex = join(outDir, "og", "index.html");

const chromeCandidates = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "google-chrome",
  "chromium",
];

const chrome = chromeCandidates.find((p) => p.startsWith("/") && existsSync(p)) ?? "google-chrome";

console.log("Building static site…");
const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(ogHtml) && !existsSync(ogIndex)) {
  console.error("Missing out/og.html — build the /og route first.");
  process.exit(1);
}

console.log(`Serving ${outDir} on :${port}…`);
const server = spawn("npx", ["serve", outDir, "-l", String(port), "--no-clipboard"], {
  cwd: root,
  stdio: "ignore",
});

await new Promise((r) => setTimeout(r, 1500));

console.log(`Capturing ${url} → public/media/ogp.png`);
const shot = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    `--screenshot=${target}`,
    url,
  ],
  { stdio: "inherit" },
);

server.kill();

if (shot.status !== 0) process.exit(shot.status ?? 1);
console.log("Done.");
