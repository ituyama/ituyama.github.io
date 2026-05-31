import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="text-[clamp(3rem,10vw,4.5rem)] font-extrabold tracking-tighter text-bento-accent">
        404
      </p>
      <h1 className="mt-2 text-[1.1rem] font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-[0.9rem] text-bento-muted">
        URL が間違っているか、移動したページです。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-bento-accent px-5 py-2.5 text-[0.9rem] font-semibold text-white no-underline transition-[filter] hover:brightness-95"
      >
        <i className="bi bi-house-door-fill" aria-hidden="true" />
        ホームへ戻る
      </Link>
    </main>
  );
}
