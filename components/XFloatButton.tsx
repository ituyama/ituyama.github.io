import { profile } from "@/lib/profile";

const x = profile.socials.find((s) => s.icon === "twitter-x" || s.name === "X");

export default function XFloatButton() {
  if (!x) return null;

  return (
    <a
      href={x.url}
      target="_blank"
      rel="noopener noreferrer"
      className="pop-btn fixed right-4 bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] z-40 shadow-[4px_4px_0_#000] md:right-6 md:bottom-6"
      aria-label="Xを見る"
    >
      <i className="bi bi-twitter-x" aria-hidden="true" />
      Xを見る
    </a>
  );
}
