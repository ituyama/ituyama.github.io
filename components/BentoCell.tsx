import type { BentoTile } from "@/lib/bentoSchema";

// Static class lookups so Tailwind's JIT keeps these utilities.
const COL_SPAN: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

function Chip({ name, size = "sm" }: { name?: string; size?: "sm" | "lg" }) {
  if (!name) return null;
  const dim =
    size === "lg" ? "size-10 text-[1.2rem] rounded-xl" : "size-8 text-[1rem] rounded-lg";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-bento-line bg-bento-panel text-bento-soft ${dim}`}
    >
      <i className={`bi bi-${name}`} aria-hidden="true" />
    </span>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-bento-muted">
      {children}
    </span>
  );
}

function Header({ tile }: { tile: BentoTile }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <Chip name={tile.icon} />
      <Kicker>{tile.title}</Kicker>
    </div>
  );
}

function CellBody({ tile }: { tile: BentoTile }) {
  switch (tile.type) {
    case "image":
      if (!tile.body) {
        return (
          <div className="flex h-full items-center justify-center text-bento-muted">
            <i className="bi bi-image text-2xl" aria-hidden="true" />
          </div>
        );
      }
      return (
        <>
          {/* Natural aspect ratio (width = column, height auto) so nothing is cropped. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.body}
            alt={tile.title || tile.caption || ""}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          {tile.caption ? (
            <span className="absolute bottom-2 left-2 rounded-full bg-bento-surface/90 px-2.5 py-1 text-[0.66rem] font-medium text-bento-ink backdrop-blur">
              {tile.caption}
            </span>
          ) : null}
        </>
      );

    case "map": {
      const place = tile.body || "日本";
      const src = `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
      return (
        <>
          <iframe
            title={`${place} の地図`}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-full w-full grayscale-[0.35] contrast-[1.05]"
          />
          <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center rounded-full bg-bento-surface/90 px-2.5 py-1 text-[0.7rem] font-semibold text-bento-ink backdrop-blur">
            {tile.body}
          </span>
          <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-bento-surface/90 px-2.5 py-1 text-[0.72rem] font-semibold text-bento-ink backdrop-blur">
            <i className="bi bi-geo-alt-fill text-bento-soft" aria-hidden="true" />
            ここにいるよ
          </span>
        </>
      );
    }

    case "profile":
      return (
        <div className="flex h-full flex-col justify-center gap-2">
          <Header tile={{ ...tile, icon: tile.icon ?? "person-badge" }} />
          <span className="text-[clamp(1.15rem,2.8vw,1.6rem)] font-bold leading-tight tracking-tight text-bento-ink">
            {tile.body}
          </span>
          {tile.caption ? (
            <span className="text-[0.82rem] font-medium text-bento-soft">{tile.caption}</span>
          ) : null}
        </div>
      );

    case "stat":
      return (
        <div className="flex h-full flex-col">
          <Header tile={tile} />
          <span className="mt-auto text-[clamp(1.7rem,4.6vw,2.6rem)] font-extrabold leading-none tracking-tight text-bento-ink">
            {tile.body}
          </span>
          {tile.caption ? (
            <span className="mt-1.5 text-[0.72rem] font-medium text-bento-soft">{tile.caption}</span>
          ) : null}
        </div>
      );

    case "code":
      return (
        <div className="flex h-full flex-col">
          <Header tile={{ ...tile, icon: tile.icon ?? "terminal" }} />
          <pre className="m-0 mt-auto overflow-x-auto rounded-[var(--radius-bento-sm)] border border-bento-line bg-bento-panel px-3 py-2.5 font-[family-name:var(--font-mono)] text-[0.7rem] leading-relaxed text-bento-soft">
            {tile.body}
          </pre>
        </div>
      );

    case "skills": {
      const items = (tile.body ?? "")
        .split(/[,、\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <div className="flex h-full flex-col">
          <Header tile={{ ...tile, icon: tile.icon ?? "stars" }} />
          <div className="mt-auto flex flex-wrap gap-1.5">
            {items.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-bento-line bg-bento-panel px-2.5 py-1.5 text-[0.76rem] font-medium text-bento-ink"
              >
                <span className="size-1.5 rounded-[2px] bg-bento-muted" aria-hidden="true" />
                {s}
              </span>
            ))}
          </div>
          {tile.caption ? (
            <span className="mt-2.5 text-[0.7rem] text-bento-muted">{tile.caption}</span>
          ) : null}
        </div>
      );
    }

    case "activity":
      return (
        <div className="flex h-full flex-col">
          <Header tile={{ ...tile, icon: tile.icon ?? "graph-up" }} />
          {/* External grass-graph image; plain img keeps it simple across hosts. */}
          {tile.body ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tile.body}
              alt="GitHub コミットグラフ（草）"
              loading="lazy"
              className="max-h-[clamp(72px,14vw,108px)] w-full rounded-[var(--radius-bento-sm)] object-contain object-left"
            />
          ) : null}
        </div>
      );

    case "link":
      return (
        <div className="flex h-full items-center gap-3">
          <Chip name={tile.icon ?? "box-arrow-up-right"} size="lg" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <Kicker>{tile.title}</Kicker>
            <span className="truncate text-[0.85rem] font-semibold text-bento-ink">
              {tile.body || tile.href?.replace(/^(https?:\/\/|mailto:)/, "") || "開く"}
            </span>
          </span>
          <i
            className="bi bi-arrow-up-right ml-auto text-[0.85rem] text-bento-muted"
            aria-hidden="true"
          />
        </div>
      );

    case "text":
    default:
      return (
        <div className="flex h-full flex-col">
          <Header tile={tile} />
          <p className="m-0 whitespace-pre-line text-[0.82rem] leading-relaxed text-bento-soft">
            {tile.body}
          </p>
          {tile.caption ? (
            <span className="mt-1.5 text-[0.7rem] text-bento-muted">{tile.caption}</span>
          ) : null}
        </div>
      );
  }
}

export default function BentoCell({
  tile,
  index,
}: {
  tile: BentoTile;
  index: number;
}) {
  const span = COL_SPAN[tile.span] ?? COL_SPAN[6];
  const isLink = tile.type === "link" && tile.href;
  const isImage = tile.type === "image";
  const isMap = tile.type === "map";

  // Cards size to their content (align-items:start on the grid), so nothing is
  // clipped and there is no stretched empty space. Images get a fixed height
  // since a fill image has no intrinsic height.
  const base = `bento-reveal group relative w-full col-span-2 ${span} rounded-[var(--radius-bento)] border border-bento-line bg-bento-surface`;
  const inner = isImage
    ? "overflow-hidden"
    : isMap
      ? "overflow-hidden aspect-[4/3]"
      : "flex flex-col p-[clamp(1rem,1.9vw,1.5rem)]";
  const className = `${base} ${inner}`;

  const style: React.CSSProperties = {
    animationDelay: `${Math.min(index * 55, 550)}ms`,
  };

  if (isLink) {
    const external = !tile.href!.startsWith("mailto:");
    return (
      <a
        href={tile.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`${className} no-underline outline-none focus-visible:border-bento-line-strong`}
        style={style}
      >
        <CellBody tile={tile} />
      </a>
    );
  }

  return (
    <article className={className} style={style}>
      <CellBody tile={tile} />
    </article>
  );
}
