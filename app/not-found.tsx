import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

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
        className="pop-btn mt-6"
      >
        <i className="bi bi-compass" aria-hidden="true" />
        ホームへ戻る
      </Link>
    </main>
  );
}
