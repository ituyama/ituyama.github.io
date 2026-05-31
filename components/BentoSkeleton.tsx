// Placeholder mosaic shown while the LLM is composing the layout. Tiles pop in
// one by one (assembling) with a faint accent shimmer + breathing faux content,
// so the build feels alive and the previous/default tiles never flash.
type Placeholder = {
  span: string;
  rowSpan: string;
  variant: "media" | "lines" | "stat";
};

const PLACEHOLDERS: Placeholder[] = [
  { span: "md:col-span-4", rowSpan: "md:row-span-2", variant: "media" },
  { span: "md:col-span-8", rowSpan: "md:row-span-1", variant: "lines" },
  { span: "md:col-span-8", rowSpan: "md:row-span-1", variant: "lines" },
  { span: "md:col-span-6", rowSpan: "md:row-span-2", variant: "stat" },
  { span: "md:col-span-6", rowSpan: "md:row-span-1", variant: "lines" },
  { span: "md:col-span-6", rowSpan: "md:row-span-1", variant: "stat" },
];

function FauxContent({ variant, delay }: { variant: Placeholder["variant"]; delay: number }) {
  const bar = "rounded-full bg-bento-panel skeleton-bar";
  if (variant === "media") {
    return (
      <div className="flex h-full flex-col gap-3">
        <div className={`${bar} aspect-square w-full rounded-[var(--radius-bento-sm)]`} style={{ animationDelay: `${delay}ms` }} />
        <div className={`${bar} h-3 w-2/3`} style={{ animationDelay: `${delay + 120}ms` }} />
      </div>
    );
  }
  if (variant === "stat") {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className={`${bar} size-7 rounded-[10px]`} style={{ animationDelay: `${delay}ms` }} />
        <div className="space-y-2">
          <div className={`${bar} h-6 w-1/2`} style={{ animationDelay: `${delay + 120}ms` }} />
          <div className={`${bar} h-3 w-3/4`} style={{ animationDelay: `${delay + 220}ms` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className={`${bar} size-7 rounded-[10px]`} style={{ animationDelay: `${delay}ms` }} />
      <div className={`${bar} h-3 w-5/6`} style={{ animationDelay: `${delay + 120}ms` }} />
      <div className={`${bar} h-3 w-2/3`} style={{ animationDelay: `${delay + 220}ms` }} />
    </div>
  );
}

export default function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[clamp(10px,1.5vw,16px)] md:grid-cols-12 md:auto-rows-[minmax(8.25rem,auto)] md:[grid-auto-flow:row_dense]">
      {PLACEHOLDERS.map((p, i) => (
        <div
          key={i}
          className={`skeleton-tile col-span-2 ${p.span} ${p.rowSpan} min-h-[8.25rem] rounded-[var(--radius-bento)] border border-bento-line bg-bento-surface p-[clamp(1rem,1.9vw,1.5rem)]`}
          style={{ animationDelay: `${i * 110}ms` }}
        >
          <FauxContent variant={p.variant} delay={i * 110} />
        </div>
      ))}
    </div>
  );
}
