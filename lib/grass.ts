export type GrassDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GrassFeed = {
  total: { lastYear: number };
  contributions: GrassDay[];
};

export const GRASS_API_PATH = "/api/grass";
export const GITHUB_USERNAME = "ituyama";

export function buildGrassWeeks(contributions: GrassDay[]) {
  if (!contributions.length) return [] as (GrassDay | null)[][];

  const first = new Date(`${contributions[0].date}T00:00:00`);
  const pad = first.getDay();
  const weeks: (GrassDay | null)[][] = [];
  let week: (GrassDay | null)[] = Array.from({ length: pad }, () => null);

  for (const day of contributions) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}
