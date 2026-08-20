"use client";

import { useState } from "react";

import { profile } from "@/lib/profile";

function displayName(name: string) {
  return name.replace(/, Inc\.$/, "");
}

export default function WorkPanel() {
  const companies = profile.companies;
  const [active, setActive] = useState(0);
  const company = companies[active] ?? companies[0];
  const education = [
    profile.university ? { label: "大学", value: profile.university } : null,
    profile.highSchool ? { label: "高校", value: profile.highSchool } : null,
  ].filter((x): x is { label: string; value: string } => Boolean(x));

  if (!company) return null;

  const title = displayName(company.name);

  return (
    <section id="work" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="work-title">
      <div className="pop-work-inner">
        <h2 id="work-title" className="pop-policy-mark">
          WORK
        </h2>

        <article className="pop-work-sheet pop-frame">
          <div className="pop-work-split">
            <ul className="pop-work-list" role="tablist" aria-label="所属">
              {companies.map((item, i) => {
                const on = i === active;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      role="tab"
                      id={`work-tab-${i}`}
                      aria-selected={on}
                      aria-controls="work-panel"
                      tabIndex={0}
                      className={`pop-work-tab ${on ? "is-on" : ""}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="pop-work-tab-name font-lineseed">{displayName(item.name)}</span>
                      <span className="pop-work-tab-role">{item.role}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="pop-work-detail"
              id="work-panel"
              role="tabpanel"
              aria-labelledby={`work-tab-${active}`}
            >
              <p className="pop-work-role">{company.role}</p>
              <h3 className="pop-work-name font-lineseed">{title}</h3>
              {company.name !== title ? (
                <p className="pop-work-legal">{company.name}</p>
              ) : null}
              {company.summary ? <p className="pop-work-summary">{company.summary}</p> : null}
              {company.focus?.length ? (
                <div className="pop-work-tags">
                  {company.focus.map((tag) => (
                    <span key={tag} className="pop-chip pop-chip-ghost">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {company.url ? (
                <a
                  href={company.url}
                  className="pop-work-link"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {company.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  <i className="bi bi-arrow-up-right" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>

          {education.length ? (
            <footer className="pop-work-sheet-foot">
              {education.map((e) => (
                <p key={e.label}>
                  <span>{e.label}</span>
                  {e.value}
                </p>
              ))}
            </footer>
          ) : null}
        </article>
      </div>
    </section>
  );
}
