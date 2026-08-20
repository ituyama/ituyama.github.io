import { profile } from "@/lib/profile";

function displayName(name: string) {
  return name.replace(/, Inc\.$/, "");
}

export default function WorkPanel() {
  const education = [
    profile.university ? { label: "大学", value: profile.university } : null,
    profile.highSchool ? { label: "高校", value: profile.highSchool } : null,
  ].filter((x): x is { label: string; value: string } => Boolean(x));
  const total = String(profile.companies.length).padStart(2, "0");

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="pop-section-title">仕事</h2>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {profile.companies.map((company, i) => {
            const title = displayName(company.name);
            const index = String(i + 1).padStart(2, "0");
            return (
              <li key={company.name} className="pop-work-card pop-frame">
                <p className="pop-work-index">
                  {index} / {total}
                </p>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="pop-work-name font-lineseed">{title}</h3>
                  <span className="pop-chip">{company.role}</span>
                </div>
                {company.name !== title ? (
                  <p className="mt-1 text-[0.78rem] font-bold text-bento-muted">{company.name}</p>
                ) : null}
                {company.summary ? (
                  <p className="pop-work-summary">{company.summary}</p>
                ) : null}
                {company.focus?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
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
              </li>
            );
          })}
        </ol>
      </section>

      {education.length ? (
        <section>
          <h2 className="pop-section-title">学歴</h2>
          <div className="pop-frame">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-bento-accent">
                  <th className="px-4 py-3 text-[0.78rem] font-extrabold">区分</th>
                  <th className="px-4 py-3 text-[0.78rem] font-extrabold">学校</th>
                </tr>
              </thead>
              <tbody>
                {education.map((e) => (
                  <tr key={e.label} className="border-t-2 border-bento-line">
                    <td className="px-4 py-3.5 text-[0.88rem] font-bold text-bento-muted">{e.label}</td>
                    <td className="px-4 py-3.5 text-[0.92rem] font-extrabold">{e.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
