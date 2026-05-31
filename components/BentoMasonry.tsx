"use client";

import { useEffect, useRef, useState } from "react";
import type { BentoTile } from "@/lib/bentoSchema";
import BentoCell from "./BentoCell";

/**
 * Uniform-column masonry (Pinterest style). Every card has the same width and
 * is stacked into the currently shortest column, so cards sit flush with no
 * internal gaps — the only difference between columns is at most one card at
 * the very bottom. Heights follow each card's content. Re-packs on container
 * resize, tile changes, image loads and font swaps.
 */
const columnCount = (w: number) => (w < 640 ? 1 : w < 1024 ? 2 : 3);

export default function BentoMasonry({ tiles }: { tiles: BentoTile[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    const pack = () => {
      const W = container.clientWidth;
      if (!W) return;

      const cols = columnCount(W);
      const gap = W < 640 ? 12 : 16;
      const colW = (W - gap * (cols - 1)) / cols;
      const heights = new Array(cols).fill(0);

      tiles.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        el.style.width = `${colW}px`;
        const h = el.offsetHeight;

        // Place into the shortest column.
        let c = 0;
        for (let k = 1; k < cols; k++) if (heights[k] < heights[c] - 0.5) c = k;

        el.style.left = `${c * (colW + gap)}px`;
        el.style.top = `${heights[c]}px`;
        heights[c] += h + gap;
      });

      const maxBottom = heights.reduce((m, b) => (b > m ? b : m), 0);
      container.style.height = `${Math.max(0, maxBottom - gap)}px`;
      setReady(true);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pack);
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    itemRefs.current.forEach((el) => el && ro.observe(el));
    schedule();

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tiles]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {tiles.map((tile, i) => (
        <div
          key={`${tile.type}-${i}-${tile.title}`}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-0 top-0"
        >
          <BentoCell tile={tile} index={i} />
        </div>
      ))}
    </div>
  );
}
