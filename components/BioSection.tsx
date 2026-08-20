import { calcAge, profile } from "@/lib/profile";

function bornLabel(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

export default function BioSection() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const born = profile.birthday ? bornLabel(profile.birthday) : "";
  const schools = [profile.university, profile.highSchool].filter(Boolean);

  return (
    <section id="bio" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="bio-title">
      <div className="pop-work-inner">
        <h2 id="bio-title" className="pop-policy-mark">
          BIO
        </h2>

        <article className="pop-work-sheet pop-frame">
          <dl className="pop-bio-list">
            <div className="pop-bio-row">
              <dt>名前</dt>
              <dd>
                <span className="font-lineseed">{profile.nameJa}</span>
                <span className="pop-bio-sub">{profile.nameEn}</span>
              </dd>
            </div>

            {born ? (
              <div className="pop-bio-row">
                <dt>生まれ</dt>
                <dd>
                  {born}
                  {age !== null ? <span className="pop-bio-sub">{age}歳</span> : null}
                </dd>
              </div>
            ) : null}

            {profile.location ? (
              <div className="pop-bio-row">
                <dt>拠点</dt>
                <dd>{profile.location}</dd>
              </div>
            ) : null}

            {schools.length ? (
              <div className="pop-bio-row">
                <dt>学歴</dt>
                <dd>
                  {schools.map((school) => (
                    <span key={school} className="pop-bio-line">
                      {school}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}

            {profile.skills.length ? (
              <div className="pop-bio-row">
                <dt>スキル</dt>
                <dd>
                  <div className="pop-skill-row pop-skill-row-tight">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="pop-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            ) : null}
          </dl>
        </article>
      </div>
    </section>
  );
}
