import BioSection from "@/components/BioSection";
import HireSection from "@/components/HireSection";
import LifePanel from "@/components/LifePanel";
import ProfileHero from "@/components/ProfileHero";
import SideNav from "@/components/SideNav";
import TagSection from "@/components/TagSection";
import TalkSection from "@/components/TalkSection";
import TickerBar from "@/components/TickerBar";
import WorkPanel from "@/components/WorkPanel";
import XFloatButton from "@/components/XFloatButton";
import { profile } from "@/lib/profile";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <TickerBar />
      <SideNav />
      <XFloatButton />
      <main>
        <ProfileHero />
        <BioSection />
        <TalkSection />
        <WorkPanel />
        <TagSection />
        <HireSection />
        <LifePanel />
      </main>
      <footer className="border-t-2 border-bento-line px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-6 text-center text-[0.76rem] font-bold text-bento-muted md:ml-[72px] md:pb-8">
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
