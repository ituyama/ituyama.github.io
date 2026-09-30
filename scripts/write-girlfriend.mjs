import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const payload = { hasGirlfriend: false };

for (const rel of ["public/data/girlfriend.json"]) {
  const target = join(root, rel);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${target}`);
}
