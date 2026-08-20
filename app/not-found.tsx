import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="font-lineseed text-[clamp(3.5rem,12vw,6rem)] font-extrabold leading-none tracking-tighter text-bento-ink">
        404
      </p>
      <h1 className="mt-3 text-[1.1rem] font-extrabold text-bento-ink">ページが見つかりません</h1>
      <p className="mt-2 text-[0.9rem] text-bento-muted">
        URL が間違っているか、移動したページです。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-bento-accent px-5 py-2.5 text-[0.9rem] font-extrabold text-bento-ink no-underline"
      >
        <i className="bi bi-compass" aria-hidden="true" />
        ホームへ戻る
      </Link>
    </main>
  );
}
