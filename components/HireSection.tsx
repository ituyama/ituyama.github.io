"use client";

import { useState } from "react";

import SectionHead from "./SectionHead";
import { hire } from "@/lib/hire";

function mailto(email: string, org: string, role: string) {
  const subject = encodeURIComponent(`募集: ${org} ${role}`);
  return `mailto:${email}?subject=${subject}`;
}

export default function HireSection() {
  const openings = hire.openings;
  const [active, setActive] = useState(0);
  const job = openings[active] ?? openings[0];

  if (!job) return null;

  const href = job.email
    ? mailto(job.email, job.org, job.role)
    : job.url;

  return (
    <section id="hire" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="hire-title">
      <div className="pop-work-inner">
        <SectionHead id="hire-title" title={hire.title} subtitle={hire.intro} />

        <article className="pop-work-sheet pop-frame">
          <div className="pop-work-split">
            <ul className="pop-work-list" role="tablist" aria-label="募集">
              {openings.map((item, i) => {
                const on = i === active;
                return (
                  <li key={`${item.org}-${item.role}`}>
                    <button
                      type="button"
                      role="tab"
                      id={`hire-tab-${i}`}
                      aria-selected={on}
                      aria-controls="hire-panel"
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
              id="hire-panel"
              role="tabpanel"
              aria-labelledby={`hire-tab-${active}`}
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
              {href ? (
                <a
                  href={href}
                  className="pop-btn pop-work-link mt-5 w-fit"
                  {...(job.url && !job.email
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                  {job.cta}
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
