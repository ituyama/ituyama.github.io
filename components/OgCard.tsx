import { profile } from "@/lib/profile";

/** 1200×630 Open Graph card — name centered, no portrait. */
export default function OgCard() {
  return (
    <div className="og-card" aria-hidden="true">
      <div className="og-card-accent og-card-accent-lime" />
      <div className="og-card-accent og-card-accent-blue" />
      <div className="og-card-inner">
        <h1 className="og-card-name">{profile.nameJa}</h1>
        <p className="og-card-en">{profile.nameEn}</p>
        {profile.tagline ? <p className="og-card-tagline">{profile.tagline}</p> : null}
        {profile.roles.length ? (
          <ul className="og-card-chips">
            {profile.roles.map((role) => (
              <li key={role}>
                <span className="pop-chip">{role}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="og-card-domain">ituyama.com</p>
      </div>
    </div>
  );
}
