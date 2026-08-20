import type { CSSProperties, ReactNode } from "react";
import type { BentoTile } from "@/lib/bentoSchema";
import { profile } from "@/lib/profile";
import Aquarium from "./Aquarium";
import DvdBounce from "./DvdBounce";
import LiveClock from "./LiveClock";
import SpotifyEmbed from "./SpotifyEmbed";
import TurnipPrice from "./TurnipPrice";

function MediaBackdrop({ icon }: { icon?: string }) {
  return (
    <div className="discover-media-fill relative h-full w-full">
      {icon ? (
        <i
          className={`bi bi-${icon} pointer-events-none absolute right-4 top-4 text-[4.2rem] text-white/15`}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

function CardFrame({
  featured,
  index,
  href,
  media,
  kicker,
  heading,
  meta,
  body,
}: {
  featured?: boolean;
  index: number;
  href?: string;
  media: ReactNode;
  kicker?: ReactNode;
  heading?: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
}) {
  const className = `bento-reveal discover-card ${featured ? "discover-card-featured" : ""}`;
  const style: CSSProperties = {
    animationDelay: `${Math.min(index * 55, 550)}ms`,
  };
  const inner = (
    <>
      <div className="discover-card-media">{media}</div>
      <div className="discover-card-body">
        {kicker ? <p className="discover-kicker">{kicker}</p> : null}
        {body ?? (
          <>
            {heading ? <h3 className="discover-heading">{heading}</h3> : null}
            {meta ? <p className="discover-meta">{meta}</p> : null}
          </>
        )}
      </div>
    </>
  );

  if (href) {
    const external = !href.startsWith("mailto:");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <article className={className} style={style}>
      {inner}
    </article>
  );
}

function CellMedia({ tile }: { tile: BentoTile }) {
  switch (tile.type) {
    case "image":
      if (!tile.body) return <MediaBackdrop icon="image" />;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.body}
          alt={tile.title || tile.caption || ""}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover"
        />
      );

    case "map": {
      const place = tile.body || "日本";
      const src = `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
      return (
        <iframe
          title={`${place} の地図`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.25] contrast-[1.05]"
        />
      );
    }

    case "time":
      return (
        <div className="discover-media-fill flex h-full flex-col justify-end p-4">
          <LiveClock invert />
        </div>
      );

    case "music":
      return (
        <div className="absolute inset-0">
          <SpotifyEmbed url={tile.body} />
        </div>
      );

    case "tweets":
      return (
        <div className="discover-media-fill relative h-full w-full">
          <i
            className="bi bi-twitter-x pointer-events-none absolute right-4 top-4 text-[3.6rem] text-white/15"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt=""
            loading="lazy"
            className="absolute left-4 bottom-4 size-16 rounded-full border-[1.5px] border-white object-cover"
          />
        </div>
      );

    case "stock":
      return <TurnipPrice />;

    case "dvd":
      return (
        <div className="absolute inset-0">
          <DvdBounce />
        </div>
      );

    case "aquarium":
      return (
        <div className="absolute inset-0">
          <Aquarium />
        </div>
      );

    case "activity":
      return (
        <div className="discover-media-fill flex h-full items-center p-4">
          {tile.body ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tile.body}
              alt="GitHub コミットグラフ（草）"
              loading="lazy"
              className="w-full object-contain"
            />
          ) : (
            <MediaBackdrop icon="graph-up" />
          )}
        </div>
      );

    case "stat":
      return (
        <div className="discover-media-fill flex h-full flex-col justify-end p-4">
          <span className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-none tracking-tight text-white">
            {tile.body}
          </span>
        </div>
      );

    case "code":
      return (
        <div className="discover-media-fill flex h-full items-end p-3">
          <pre className="m-0 max-h-full w-full overflow-auto rounded-[10px] bg-black/35 px-3 py-2.5 font-[family-name:var(--font-mono)] text-[0.68rem] leading-relaxed text-white/90">
            {tile.body}
          </pre>
        </div>
      );

    default:
      return <MediaBackdrop icon={tile.icon} />;
  }
}

function CellBody({ tile }: { tile: BentoTile }) {
  switch (tile.type) {
    case "skills": {
      const items = (tile.body ?? "")
        .split(/[,、\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        kicker: tile.title || "Skills",
        body: (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {items.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="rounded-full bg-bento-accent px-2.5 py-1 text-[0.7rem] font-bold text-bento-ink"
              >
                {s}
              </span>
            ))}
          </div>
        ),
      };
    }

    case "image":
      return {
        kicker: tile.body === profile.avatar ? "Profile" : "Photo",
        heading: tile.title,
        meta: tile.caption && tile.caption !== tile.title ? tile.caption : undefined,
      };

    case "map":
      return {
        kicker: tile.title || "Location",
        heading: tile.body,
        meta: "ここにいるよ",
      };

    case "time":
      return {
        kicker: tile.title || "Local time",
        heading: "Japan Standard Time",
        meta: "Asia/Tokyo",
      };

    case "music":
      return {
        kicker: tile.title || "Now playing",
        heading: "Spotify",
        meta: "プレイリスト",
      };

    case "tweets": {
      const handle = (tile.body || "@PM80437319").replace(/^@?/, "@");
      return {
        kicker: tile.title || "X (Twitter)",
        heading: profile.nameJa,
        meta: handle,
      };
    }

    case "stock":
      return {
        kicker: "マーケット",
        heading: "カブ価",
        meta: "日経平均 連動",
      };

    case "dvd":
      return {
        kicker: tile.title || "DVD",
        heading: "DVDのアレ",
        meta: "角に当たると点が入る",
      };

    case "aquarium":
      return {
        kicker: tile.title || "Goldfish",
        heading: "金魚",
        meta: "タップでエサ",
      };

    case "profile":
      return {
        kicker: tile.title || "Profile",
        heading: tile.body,
        meta: tile.caption,
      };

    case "stat":
      return {
        kicker: tile.title,
        heading: tile.caption || tile.title,
        meta: undefined,
      };

    case "code":
      return {
        kicker: tile.title || "Code",
        heading: tile.caption || "snippet",
      };

    case "activity":
      return {
        kicker: tile.title || "GitHub",
        heading: "Activity",
        meta: "ituyama",
      };

    case "link":
      return {
        kicker: tile.title,
        heading: tile.body || tile.href?.replace(/^(https?:\/\/|mailto:)/, "") || "開く",
        meta: "開く ↗",
      };

    case "text":
    default:
      return {
        kicker: tile.title,
        heading: tile.body ? (
          <span className="whitespace-pre-line">{tile.body}</span>
        ) : undefined,
        meta: tile.caption,
      };
  }
}

export default function BentoCell({
  tile,
  index,
  featured,
}: {
  tile: BentoTile;
  index: number;
  featured?: boolean;
}) {
  const isLink = (tile.type === "link" || tile.type === "tweets") && tile.href;
  const copy = CellBody({ tile });

  return (
    <CardFrame
      featured={featured}
      index={index}
      href={isLink ? tile.href : undefined}
      media={<CellMedia tile={tile} />}
      kicker={copy.kicker}
      heading={copy.heading}
      meta={copy.meta}
      body={copy.body}
    />
  );
}
