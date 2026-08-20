"use client";

import { useMemo, useState } from "react";

import { profile } from "@/lib/profile";
import Aquarium from "./Aquarium";
import BandSheet from "./BandSheet";
import DvdBounce from "./DvdBounce";
import SpotifyEmbed from "./SpotifyEmbed";
import TurnipPrice from "./TurnipPrice";

type Item =
  | { name: string; kind: "fish" | "music" | "stock" | "dvd" | "car" }
  | { name: string; kind: "photo"; src: string; caption: string };

export default function PlayPanel() {
  const items = useMemo<Item[]>(() => {
    const next: Item[] = [{ name: "金魚", kind: "fish" }];
    if (profile.spotify) next.push({ name: "聴いてる", kind: "music" });
    next.push({ name: "カブ価", kind: "stock" });
    next.push({ name: "DVD", kind: "dvd" });
    if (profile.carImage || profile.car) next.push({ name: "車", kind: "car" });
    for (const shot of profile.gallery) {
      next.push({ name: shot.caption || "写真", kind: "photo", src: shot.src, caption: shot.caption });
    }
    return next;
  }, []);

  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;

  return (
    <BandSheet
      id="play"
      title="PLAY"
      label="遊び"
      tabs={items.map((x) => x.name)}
      active={active}
      onChange={setActive}
      flush
    >
      {item.kind === "fish" ? (
        <>
          <div className="pop-work-stage">
            <Aquarium />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">金魚</p>
            <p className="pop-work-summary">タップでエサ</p>
          </div>
        </>
      ) : null}

      {item.kind === "music" ? (
        <>
          <div className="pop-work-stage is-music">
            <SpotifyEmbed url={profile.spotify} />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">Spotify</p>
            <p className="pop-work-summary">プレイリスト</p>
          </div>
        </>
      ) : null}

      {item.kind === "stock" ? (
        <>
          <div className="pop-work-stage">
            <TurnipPrice />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">マーケット</p>
            <p className="pop-work-summary">日経平均に連動したカブ価</p>
          </div>
        </>
      ) : null}

      {item.kind === "dvd" ? (
        <>
          <div className="pop-work-stage">
            <DvdBounce />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">DVD</p>
            <p className="pop-work-summary">角に当たると点が入る</p>
          </div>
        </>
      ) : null}

      {item.kind === "car" ? (
        <>
          <div className="pop-work-stage is-light">
            {profile.carImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.carImage}
                alt={profile.car || "車"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">愛車</p>
            <p className="pop-work-summary">{profile.car}</p>
          </div>
        </>
      ) : null}

      {item.kind === "photo" ? (
        <>
          <div className="pop-work-stage is-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.caption} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="pop-work-cap">
            <p className="pop-work-role">写真</p>
            <p className="pop-work-summary">{item.caption}</p>
          </div>
        </>
      ) : null}
    </BandSheet>
  );
}
