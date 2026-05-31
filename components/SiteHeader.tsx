"use client";

export default function SiteHeader({
  onHome,
  onReset,
}: {
  onHome: () => void;
  onReset: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-bento-line bg-bento-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-[clamp(0.75rem,3vw,1.5rem)]">
        <button
          type="button"
          onClick={onHome}
          className="font-lineseed text-[0.95rem] font-extrabold uppercase tracking-[0.18em] text-bento-ink"
          aria-label="トップに戻る"
        >
          YAMANO ITSUKI
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border border-bento-line bg-bento-surface px-3 py-1.5 text-[0.72rem] font-medium text-bento-soft"
        >
          <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
          もう一度聞く
        </button>
      </div>
    </header>
  );
}
