import { profile } from "@/lib/profile";

export default function TalkSection() {
  const body = profile.policy.trim();
  if (!body) return null;

  const sentences = body.split(/(?<=。)/).map((s) => s.trim()).filter(Boolean);
  const fadeFrom = Math.max(0, sentences.length - 2);
  const head = sentences.slice(0, fadeFrom).join("");
  const tail = sentences.slice(fadeFrom).join("");

  return (
    <section
      id="talk"
      className="pop-policy scroll-mt-10 md:pl-[72px]"
      aria-labelledby="talk-title"
    >
      <div className="pop-policy-dots" aria-hidden="true" />
      <svg className="pop-policy-deco pop-policy-deco-disc" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="#4d7cff" stroke="#000" strokeWidth="3" />
        <circle cx="50" cy="50" r="18" fill="#00e676" stroke="#000" strokeWidth="3" />
      </svg>
      <svg className="pop-policy-deco pop-policy-deco-mic" viewBox="0 0 80 140" aria-hidden="true">
        <rect x="28" y="8" width="24" height="72" rx="12" fill="#111" stroke="#000" strokeWidth="3" />
        <circle cx="40" cy="20" r="14" fill="#7a5cff" stroke="#000" strokeWidth="3" />
        <path d="M16 62v10a24 24 0 0 0 48 0V62" fill="none" stroke="#000" strokeWidth="3" />
        <rect x="36" y="96" width="8" height="28" fill="#111" />
        <rect x="18" y="122" width="44" height="10" rx="2" fill="#111" />
      </svg>

      <div className="pop-policy-inner">
        <h2 id="talk-title" className="pop-policy-mark">
          MY POLICY
        </h2>
        <p className="pop-policy-body">
          {head}
          {tail ? <span className="pop-policy-fade"> {tail}</span> : null}
        </p>
      </div>
    </section>
  );
}
