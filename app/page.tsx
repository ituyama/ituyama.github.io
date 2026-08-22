import BioSection from "@/components/BioSection";
import GrassSection from "@/components/GrassSection";
import HireSection from "@/components/HireSection";
import JobsSection from "@/components/JobsSection";
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
        <GrassSection />
        <JobsSection />
        <HireSection />
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
