import { profile } from "@/lib/profile";

export default function WorkPanel() {
  const education = [
    profile.university ? { label: "大学", value: profile.university } : null,
    profile.highSchool ? { label: "高校", value: profile.highSchool } : null,
  ].filter((x): x is { label: string; value: string } => Boolean(x));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="pop-section-title">仕事</h2>
        <div className="pop-frame">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-bento-accent">
                <th className="px-4 py-3 text-[0.78rem] font-extrabold">会社</th>
                <th className="px-4 py-3 text-[0.78rem] font-extrabold">役割</th>
              </tr>
            </thead>
            <tbody>
              {profile.companies.map((c) => (
                <tr key={c.name} className="border-t-2 border-bento-line">
                  <td className="px-4 py-3.5 text-[0.92rem] font-extrabold">{c.name}</td>
                  <td className="px-4 py-3.5 text-[0.88rem] font-medium text-bento-soft">{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
