"use client";

import { useState } from "react";

import { work } from "@/lib/work";

function displayName(name: string) {
  return name.replace(/, Inc\.$/, "");
}

export default function WorkPanel() {
  const items = work.items;
  const [active, setActive] = useState(0);
  const company = items[active] ?? items[0];

  if (!company) return null;

  return (
    <section id="work" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="work-title">
      <div className="pop-work-inner">
        <h2 id="work-title" className="pop-policy-mark">
          {work.title}
        </h2>
        {work.subtitle ? <p className="pop-section-intro">{work.subtitle}</p> : null}

        <article className="pop-work-sheet pop-frame">
          <div className="pop-work-split">
            <ul className="pop-work-list" role="tablist" aria-label="所属">
              {items.map((item, i) => {
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
              {company.url ? (
                <a
                  href={company.url}
                  className="pop-btn pop-work-link mt-5 w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  サイトを見る
                </a>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
