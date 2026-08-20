import BentoGrid from "@/components/BentoGrid";
import ProfileBio from "@/components/ProfileBio";
import ProfileHero from "@/components/ProfileHero";
import { initialLayout, profile } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <ProfileHero />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-14 px-[clamp(1.15rem,4vw,2.5rem)] py-14 md:py-20">
        <ProfileBio />
        <section className="flex flex-col gap-5">
          <h2 className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-bento-muted">
            More
          </h2>
          <BentoGrid tiles={initialLayout.tiles} />
        </section>
      </main>
      <footer className="border-t-[1.5px] border-bento-ink/10 px-[clamp(1.15rem,4vw,2.5rem)] py-8 text-center text-[0.78rem] font-medium text-bento-muted">
        {profile.nameJa} / {profile.nameEn}
      </footer>
    </>
  );
}
