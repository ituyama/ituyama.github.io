import { profile } from "@/lib/profile";
import { tags } from "@/lib/tags";

export default function TagSection() {
  if (!tags.items.length) return null;

  return (
    <section id="tag" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="tag-title">
      <div className="pop-work-inner">
        <h2 id="tag-title" className="pop-policy-mark">
          {tags.title}
        </h2>
        {tags.subtitle ? <p className="pop-section-intro">{tags.subtitle}</p> : null}
        <ul className="pop-tag-list">
          {tags.items.map((tag) => (
            <li key={tag}>
              <span className="pop-chip">{tag}</span>
            </li>
          ))}
        </ul>
        {tags.cta && profile.email ? (
          <a href={`mailto:${profile.email}`} className="pop-btn w-fit">
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            {tags.cta}
          </a>
        ) : null}
      </div>
    </section>
  );
}
