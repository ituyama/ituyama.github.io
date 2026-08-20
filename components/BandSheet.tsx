"use client";

import type { ReactNode } from "react";

import SectionHead from "./SectionHead";

export default function BandSheet({
  id,
  title,
  label,
  tone = "grid",
  tabs,
  active,
  onChange,
  flush = false,
  children,
}: {
  id: string;
  title: string;
  label: string;
  tone?: "grid" | "lime";
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${tone === "lime" ? "pop-lime" : "pop-work"} scroll-mt-10 md:pl-[72px]`}
      aria-labelledby={`${id}-title`}
    >
      {tone === "lime" ? <div className="pop-policy-dots" aria-hidden="true" /> : null}
      <div className="pop-work-inner">
        <SectionHead id={`${id}-title`} title={title} />
        <article className="pop-work-sheet pop-frame">
          <div className="pop-work-split">
            <ul className="pop-work-list" role="tablist" aria-label={label}>
              {tabs.map((name, i) => {
                const on = i === active;
                return (
                  <li key={`${name}-${i}`}>
                    <button
                      type="button"
                      role="tab"
                      id={`${id}-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`${id}-panel`}
                      className={`pop-work-tab ${on ? "is-on" : ""}`}
                      onClick={() => onChange(i)}
                    >
                      <span className="pop-work-tab-name font-lineseed">{name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div
              className={`pop-work-detail ${flush ? "is-flush" : ""}`}
              id={`${id}-panel`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${active}`}
            >
              {children}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
