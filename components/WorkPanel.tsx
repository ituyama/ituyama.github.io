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

  if (!company) return null;

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
                      className={`pop-work-tab ${on ? "is-on" : ""}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="pop-work-tab-name font-lineseed">{displayName(item.name)}</span>
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
              {company.summary ? <p className="pop-work-summary">{company.summary}</p> : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
