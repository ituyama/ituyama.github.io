import BentoGrid from "@/components/BentoGrid";
import ProfileHero, { MetricsRow } from "@/components/ProfileHero";
import SideNav from "@/components/SideNav";
import TalkSection from "@/components/TalkSection";
import TickerBar from "@/components/TickerBar";
import WorkPanel from "@/components/WorkPanel";
import XFloatButton from "@/components/XFloatButton";
import { initialLayout, profile } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <TickerBar />
      <SideNav />
      <XFloatButton />
      <ProfileHero />
      <TalkSection />
      <WorkPanel />
      <main className="relative z-10 mx-auto flex max-w-[1120px] flex-col gap-10 px-[clamp(0.85rem,3vw,1.75rem)] pb-24 pt-8 md:ml-[72px] md:pb-12">
        <MetricsRow />
        <section id="more">
          <BentoGrid tiles={initialLayout.tiles} />
        </section>
      </main>
      <footer className="border-t-2 border-bento-line py-6 text-center text-[0.76rem] font-bold text-bento-muted md:ml-[72px]">
        {profile.nameJa} / {profile.nameEn}
      </footer>
    </>
  );
}
