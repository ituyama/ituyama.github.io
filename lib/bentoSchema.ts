import { z } from "zod";

/**
 * Pastel accent palette for tiles. The LLM picks an accent name and the UI
 * maps it to concrete colors (see components/BentoCell.tsx). Using a fixed
 * enum keeps the generated layout on-brand instead of arbitrary hex values.
 */
export const accentNames = [
  "sky",
  "rose",
  "violet",
  "mint",
  "amber",
  "peach",
  "indigo",
  "cyan",
] as const;

export type AccentName = (typeof accentNames)[number];

/**
 * Tile kinds the model can emit. Each maps to a distinct renderer.
 */
export const tileTypes = [
  "text",
  "stat",
  "link",
  "code",
  "skills",
  "profile",
  "activity",
  "image",
  "map",
  "time",
  "music",
  "aquarium",
  "tweets",
  "dvd",
  "stock",
] as const;

export type TileType = (typeof tileTypes)[number];

export const bentoTileSchema = z.object({
  type: z
    .enum(tileTypes)
    .describe(
      "Tile renderer. text: short prose. stat: a big value + label. link: clickable card. code: monospace snippet. skills: a set of skill tags (put the skills in body as a comma-separated list, e.g. 'Python, TypeScript, LLM'). profile: name/identity card (no photo). activity: GitHub contribution graph. image: a full-bleed standalone image block (put the image URL/path in body); use for the portrait /media/yamanopic.png. map: an embedded map of a place (put the place name in body, e.g. '神奈川県'); use for location instead of a stat tile. time: a live local clock (no body needed; shows the current time in Japan). music: an embedded Spotify player (put the Spotify URL in body). aquarium: a calm animated goldfish bowl (no body needed); a relaxing decorative tile. tweets: a card linking to the X (Twitter) profile (put the X handle in body and the profile URL in href). dvd: the classic bouncing DVD-logo screensaver (no body needed); a playful decorative tile. stock: an Animal-Crossing-style turnip-price (カブ価) tile that tracks the live Nikkei 225 in Bells (no body needed).",
    ),
  title: z
    .string()
    .max(40)
    .describe("Short tile heading / kicker. Keep it punchy."),
  body: z
    .string()
    .max(220)
    .optional()
    .describe(
      "Main content. For stat tiles put the big value here (e.g. '3年'). For code tiles put the snippet. For image tiles put the image URL/path. For link tiles this can be the handle/label (optional if a title+href is enough). Keep it concise.",
    ),
  caption: z
    .string()
    .max(80)
    .optional()
    .describe("Optional small sub-label, e.g. the unit of a stat or a hint."),
  href: z
    .string()
    .optional()
    .describe("Required only for link tiles: the destination URL."),
  icon: z
    .string()
    .optional()
    .describe(
      "Optional Bootstrap Icons name without the 'bi-' prefix, e.g. 'github', 'envelope-fill', 'code-slash', 'geo-alt-fill'.",
    ),
  accent: z
    .enum(accentNames)
    .describe("Pastel background color name for this tile."),
  span: z
    .number()
    .int()
    .min(3)
    .max(12)
    .describe(
      "Column span on a 12-column grid (desktop). Use 3, 4, 6, 8 or 12. Vary spans a lot so the grid feels dynamic, not uniform.",
    ),
  rowSpan: z
    .number()
    .int()
    .min(1)
    .max(2)
    .optional()
    .describe(
      "Row (height) span. Use 2 to make a tile taller for emphasis (good for profile, code, a featured stat), 1 for compact tiles. Mix 1 and 2 to create a dynamic mosaic. Default 1.",
    ),
});

export type BentoTile = z.infer<typeof bentoTileSchema>;

export const bentoLayoutSchema = z.object({
  intro: z
    .string()
    .max(120)
    .describe(
      "One short sentence (Japanese) answering the user, shown above the tiles.",
    ),
  tiles: z
    .array(bentoTileSchema)
    .min(5)
    .max(9)
    .describe(
      "The Bento tiles that compose the answer. Return 5-9 tiles so the grid feels full and rich, never sparse.",
    ),
});

export type BentoLayout = z.infer<typeof bentoLayoutSchema>;
