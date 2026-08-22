import type { GrassFeed } from "../../lib/grass";

const USERNAME = "ituyama";

export async function fetchGrass(): Promise<GrassFeed> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!res.ok) throw new Error(`grass ${res.status}`);
  return (await res.json()) as GrassFeed;
}
