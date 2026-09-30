import { execSync } from "node:child_process";

const root = process.cwd();

execSync("npm run build", { cwd: root, stdio: "inherit" });
execSync("npx wrangler deploy", { cwd: root, stdio: "inherit" });

console.log("Deployed to Cloudflare Workers (ituyama.com).");
