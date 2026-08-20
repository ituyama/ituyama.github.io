import { profile } from "@/lib/profile";

export default function BioSection() {
  const body = profile.about.trim();
  if (!body) return null;

  const sentences = body.split(/(?<=。)/).map((s) => s.trim()).filter(Boolean);
  const fadeFrom = Math.max(0, sentences.length - 1);
  const head = sentences.slice(0, fadeFrom).join("");
  const tail = sentences.slice(fadeFrom).join("");

  return (
    <section id="bio" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="bio-title">
      <div className="pop-policy-inner">
        <h2 id="bio-title" className="pop-policy-mark pop-policy-mark-long">
          BIOGRAPHY
        </h2>
        <p className="pop-policy-body">
          {head}
          {tail ? <span className="pop-policy-fade"> {tail}</span> : null}
        </p>
      </div>
    </section>
  );
}
