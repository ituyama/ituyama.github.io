import { profile } from "@/lib/profile";

function displayName(name: string) {
  return name.replace(/, Inc\.$/, "");
}

export default function WorkPanel() {
  const education = [
    profile.university ? { label: "大学", value: profile.university } : null,
    profile.highSchool ? { label: "高校", value: profile.highSchool } : null,
  ].filter((x): x is { label: string; value: string } => Boolean(x));

  return (
    <section id="work" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="work-title">
      <div className="pop-work-inner">
        <h2 id="work-title" className="pop-policy-mark">
          WORK
        </h2>

        <article className="pop-work-sheet pop-frame">
          <ol className="pop-work-cols">
            {profile.companies.map((company) => {
              const title = displayName(company.name);
              const inner = (
                <>
                  <h3 className="pop-work-name font-lineseed">{title}</h3>
                  <p className="pop-work-role">{company.role}</p>
                  {company.summary ? <p className="pop-work-summary">{company.summary}</p> : null}
                  {company.focus?.length ? (
                    <p className="pop-work-focus">{company.focus.join(" / ")}</p>
                  ) : null}
                </>
              );
              return (
                <li key={company.name} className="pop-work-col">
                  {company.url ? (
                    <a
                      href={company.url}
                      className="pop-work-col-link"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ol>

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
