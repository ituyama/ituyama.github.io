import BioSection from "@/components/BioSection";
import LifePanel from "@/components/LifePanel";
import PlayPanel from "@/components/PlayPanel";
import ProfileHero from "@/components/ProfileHero";
import SideNav from "@/components/SideNav";
import TalkSection from "@/components/TalkSection";
import TickerBar from "@/components/TickerBar";
import WorkPanel from "@/components/WorkPanel";
import XFloatButton from "@/components/XFloatButton";
import { profile } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <TickerBar />
      <SideNav />
      <XFloatButton />
      <ProfileHero />
      <BioSection />
      <TalkSection />
      <WorkPanel />
      <LifePanel />
      <PlayPanel />
      <footer className="border-t-2 border-bento-line px-4 pb-[calc(5.2rem+env(safe-area-inset-bottom,0px))] pt-6 text-center text-[0.76rem] font-bold text-bento-muted md:ml-[72px] md:pb-8">
        {profile.nameJa} / {profile.nameEn}
      </footer>
    </>
  );
}
