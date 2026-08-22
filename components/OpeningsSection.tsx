"use client";

import { useState } from "react";

import MatchApp from "@/components/MatchApp";
import type { OpeningsFeed } from "@/lib/openings";

function mailto(email: string, org: string, role: string, prefix = "募集") {
  const subject = encodeURIComponent(`${prefix}: ${org} ${role}`);
  return `mailto:${email}?subject=${subject}`;
}

type Props = {
  id: string;
  feed: OpeningsFeed;
};

export default function OpeningsSection({ id, feed }: Props) {
  const openings = feed.openings;
  const [active, setActive] = useState(0);
  const [matchOpen, setMatchOpen] = useState(false);
  const job = openings[active] ?? openings[0];

  if (!job) return null;

  const href = job.email ? mailto(job.email, job.org, job.role, feed.mailtoPrefix) : job.url;
  const titleId = `${id}-title`;
  const panelId = `${id}-panel`;

  return (
    <section id={id} className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby={titleId}>
      <div className="pop-work-inner">
        <h2 id={titleId} className="pop-policy-mark">
          {feed.title}
        </h2>
        {feed.intro ? <p className="pop-section-intro">{feed.intro}</p> : null}

        <article className="pop-work-sheet pop-frame">
          <div className="pop-work-split">
            <ul className="pop-work-list" role="tablist" aria-label={feed.title}>
              {openings.map((item, i) => {
                const on = i === active;
                return (
                  <li key={`${item.org}-${item.role}`}>
                    <button
                      type="button"
                      role="tab"
                      id={`${id}-tab-${i}`}
                      aria-selected={on}
                      aria-controls={panelId}
                      className={`pop-work-tab ${on ? "is-on" : ""}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="pop-work-tab-name font-lineseed">{item.org}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="pop-work-detail"
              id={panelId}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${active}`}
            >
              <p className="pop-work-role">{job.role}</p>
              {job.summary ? <p className="pop-work-summary">{job.summary}</p> : null}
              {job.tags.length ? (
                <div className="pop-hire-tags">
                  {job.tags.map((tag) => (
                    <span key={tag} className="pop-chip pop-chip-ghost">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {job.match ? (
                  <button type="button" className="pop-btn pop-match-open" onClick={() => setMatchOpen(true)}>
                    <i className="bi bi-heart-fill" aria-hidden="true" />
                    マッチング
                  </button>
                ) : null}
                {href ? (
                  <a
                    href={href}
                    className="pop-btn pop-work-link w-fit"
                    {...(job.url && !job.email ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <i className="bi bi-envelope-fill" aria-hidden="true" />
                    {job.cta}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </div>

      <MatchApp open={matchOpen} onClose={() => setMatchOpen(false)} />
    </section>
  );
}
