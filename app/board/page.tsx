import type { Metadata } from "next";
import { Suspense } from "react";
import BoardApp from "@/components/BoardApp";
import SideNav from "@/components/SideNav";
import TickerBar from "@/components/TickerBar";
import XFloatButton from "@/components/XFloatButton";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "掲示板",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <TickerBar />
      <SideNav />
      <XFloatButton />
      <main className="md:ml-[72px]">
        <Suspense fallback={<p className="pop-board-muted px-4 py-10">読み込み中…</p>}>
          <BoardApp />
        </Suspense>
      </main>
      <footer className="border-t-2 border-bento-line px-4 pb-[max(4.5rem,calc(env(safe-area-inset-bottom,0px)+3.5rem))] pt-6 text-center text-[0.76rem] font-bold text-bento-muted md:ml-[72px] md:pb-8">
        <p>
          © {year} {profile.nameJa} / {profile.nameEn}
        </p>
        <p className="mt-1">
          <a href="https://ituyama.com">ituyama.com</a>
        </p>
      </footer>
    </>
  );
}
