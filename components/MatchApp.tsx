"use client";

import { useEffect, useId, useState } from "react";

import { calcAge, profile } from "@/lib/profile";

type MatchAppProps = {
  open: boolean;
  onClose: () => void;
};

function mailtoMatch() {
  const subject = encodeURIComponent("マッチングしました");
  const body = encodeURIComponent("話し合いができる彼女枠、マッチングアプリから連絡しました。");
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export default function MatchApp({ open, onClose }: MatchAppProps) {
  const titleId = useId();
  const age = profile.birthday ? calcAge(profile.birthday) : null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pop-match-root" role="presentation" onClick={onClose}>
      <div
        className="pop-match-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pop-match-header">
          <span className="pop-match-logo" id={titleId}>
            YAMANO MATCH
          </span>
          <button type="button" className="pop-match-close" onClick={onClose} aria-label="閉じる">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        <MatchFlow age={age} onClose={onClose} />
      </div>
    </div>
  );
}

function MatchFlow({ age, onClose }: { age: number | null; onClose: () => void }) {
  const [phase, setPhase] = useState<"card" | "matched" | "nope">("card");

  if (phase === "matched") {
    return (
      <div className="pop-match-panel pop-match-panel-celebrate">
        <p className="pop-match-kicker">It&apos;s a Match!</p>
        <h3 className="pop-match-title">マッチしました</h3>
        <div className="pop-match-pair">
          <div className="pop-match-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar} alt="" className="pop-match-avatar" />
            <span className="pop-match-avatar-label">あなた</span>
          </div>
          <span className="pop-match-heart" aria-hidden="true">
            ♥
          </span>
          <div className="pop-match-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar} alt="" className="pop-match-avatar" />
            <span className="pop-match-avatar-label">{profile.nameJa}</span>
          </div>
        </div>
        <p className="pop-match-copy">話し合い、から始めよう。</p>
        <div className="pop-match-actions pop-match-actions-stack">
          <a href={mailtoMatch()} className="pop-btn pop-match-btn-primary">
            <i className="bi bi-chat-heart-fill" aria-hidden="true" />
            メッセージを送る
          </a>
          <button type="button" className="pop-btn pop-match-btn-ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    );
  }

  if (phase === "nope") {
    return (
      <div className="pop-match-panel">
        <p className="pop-match-kicker">Pass</p>
        <h3 className="pop-match-title">残念...</h3>
        <p className="pop-match-copy">また今度。いつでも右スワイプ待ってます。</p>
        <div className="pop-match-actions pop-match-actions-stack">
          <button type="button" className="pop-btn" onClick={() => setPhase("card")}>
            もう一度見る
          </button>
          <button type="button" className="pop-btn pop-match-btn-ghost" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pop-match-card">
        <div className="pop-match-card-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt={profile.nameJa} className="pop-match-card-photo" />
          <div className="pop-match-card-gradient" aria-hidden="true" />
          <div className="pop-match-card-copy">
            <p className="pop-match-card-name">
              {profile.nameJa}
              {age != null ? `, ${age}` : ""}
            </p>
            {profile.location ? <p className="pop-match-card-meta">{profile.location}</p> : null}
          </div>
        </div>
        <div className="pop-match-card-body">
          {profile.tagline ? <p className="pop-match-card-tagline">{profile.tagline}</p> : null}
          <div className="pop-match-card-tags">
            {profile.roles.map((role) => (
              <span key={role} className="pop-chip">
                {role}
              </span>
            ))}
          </div>
          <p className="pop-match-card-bio">
            話し合いができる彼女を探しています。他はもうなんでもいいです。
          </p>
        </div>
      </div>

      <div className="pop-match-actions">
        <button
          type="button"
          className="pop-match-action pop-match-action-nope"
          aria-label="パス"
          onClick={() => setPhase("nope")}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pop-match-action pop-match-action-like"
          aria-label="いいね"
          onClick={() => setPhase("matched")}
        >
          <i className="bi bi-heart-fill" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
