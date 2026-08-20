import { hire } from "@/lib/hire";
import { calcAge, profile } from "@/lib/profile";
import { tags } from "@/lib/tags";
import { work } from "@/lib/work";

/**
 * Server-rendered, fully crawlable summary of the profile facts.
 *
 * The visible UI is a client-rendered card grid. This block puts every fact
 * into the initial HTML as plain semantic markup so crawlers and screen
 * readers get the complete picture regardless of JavaScript. It is visually
 * hidden but present in the DOM.
 */
export default function ProfileFacts() {
  const age = profile.birthday ? calcAge(profile.birthday) : null;

  return (
    <section className="sr-only" aria-label={`${profile.nameJa}（${profile.nameEn}）のプロフィール`}>
      <p>
        {profile.nameJa} / {profile.nameEn}
      </p>
      {profile.tagline ? <p>{profile.tagline}</p> : null}
      {profile.policy ? <p>{profile.policy}</p> : null}
      {profile.roles.length ? <p>{profile.roles.join(" / ")}</p> : null}
      {profile.about ? <p>{profile.about}</p> : null}

      <dl>
        {age !== null ? (
          <>
            <dt>年齢</dt>
            <dd>{age}歳</dd>
          </>
        ) : null}
        {profile.birthday ? (
          <>
            <dt>生年月日</dt>
            <dd>{profile.birthday}</dd>
          </>
        ) : null}
        {profile.location ? (
          <>
            <dt>拠点</dt>
            <dd>{profile.location}</dd>
          </>
        ) : null}
        {profile.car ? (
          <>
            <dt>愛車</dt>
            <dd>{profile.car}</dd>
          </>
        ) : null}
      </dl>

      {work.items.length ? (
        <section aria-label="所属">
          <h2>所属</h2>
          <ul>
            {work.items.map((c) => (
              <li key={c.name}>
                <p>
                  {c.name} — {c.role}
                </p>
                {c.summary ? <p>{c.summary}</p> : null}
                {c.focus?.length ? <p>{c.focus.join("、")}</p> : null}
                {c.url ? (
                  <p>
                    <a href={c.url} rel="noopener noreferrer">
                      {c.url}
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.university || profile.highSchool ? (
        <section aria-label="学歴">
          <h2>学歴</h2>
          <ul>
            {profile.university ? <li>{profile.university}</li> : null}
            {profile.highSchool ? <li>{profile.highSchool}</li> : null}
          </ul>
        </section>
      ) : null}

      {hire.openings.length ? (
        <section aria-label="募集">
          <h2>募集</h2>
          {hire.intro ? <p>{hire.intro}</p> : null}
          <ul>
            {hire.openings.map((job) => (
              <li key={`${job.org}-${job.role}`}>
                <p>
                  {job.org} — {job.role}
                </p>
                {job.summary ? <p>{job.summary}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tags.items.length ? (
        <section aria-label="スキル">
          <h2>スキル</h2>
          <ul>
            {tags.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label="連絡先・リンク">
        <h2>連絡先・リンク</h2>
        <ul>
          {profile.email ? (
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
          ) : null}
          {profile.socials.map((s) => (
            <li key={s.url}>
              <a href={s.url} rel="me noopener noreferrer">
                {s.name}: {s.handle}
              </a>
            </li>
          ))}
          {profile.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
