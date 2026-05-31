import type { BentoTile } from "@/lib/bentoSchema";
import BentoCell from "./BentoCell";

export default function BentoGrid({ tiles }: { tiles: BentoTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-[clamp(10px,1.5vw,16px)] md:grid-cols-12 md:auto-rows-[minmax(8.25rem,auto)] md:[grid-auto-flow:row_dense]">
      {tiles.map((tile, i) => (
        <BentoCell key={`${tile.type}-${i}-${tile.title}`} tile={tile} index={i} />
      ))}
    </div>
  );
}
