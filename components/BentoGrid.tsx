import type { BentoTile } from "@/lib/bentoSchema";
import BentoCell from "./BentoCell";

export default function BentoGrid({ tiles }: { tiles: BentoTile[] }) {
  return (
    <div className="discover-grid">
      {tiles.map((tile, i) => (
        <BentoCell key={`${tile.type}-${i}-${tile.title}`} tile={tile} index={i} />
      ))}
    </div>
  );
}
