"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { calcAge, profile } from "@/lib/profile";

type MatchAppProps = {
  open: boolean;
  onClose: () => void;
};

type Phase = "card" | "matched" | "nope";
type ExitDir = "left" | "right";

const SWIPE_THRESHOLD = 88;
const EXIT_MS = 260;

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
  const [phase, setPhase] = useState<Phase>("card");
  const [swipeRequest, setSwipeRequest] = useState<ExitDir | null>(null);

  const finishSwipe = useCallback((dir: ExitDir) => {
    setSwipeRequest(null);
    setPhase(dir === "right" ? "matched" : "nope");
  }, []);

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
      <SwipeableCard age={age} request={swipeRequest} onSwipe={finishSwipe} />
      <div className="pop-match-actions">
        <button
          type="button"
          className="pop-match-action pop-match-action-nope"
          aria-label="パス"
          onClick={() => setSwipeRequest("left")}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pop-match-action pop-match-action-like"
          aria-label="いいね"
          onClick={() => setSwipeRequest("right")}
        >
          <i className="bi bi-heart-fill" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

function SwipeableCard({
  age,
  request,
  onSwipe,
}: {
  age: number | null;
  request: ExitDir | null;
  onSwipe: (dir: ExitDir) => void;
}) {
  const dragRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const exitingRef = useRef(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<ExitDir | null>(null);

  const animateOut = useCallback(
    (dir: ExitDir) => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      setExit(dir);
      setDragging(false);
      dragRef.current = null;
      window.setTimeout(() => onSwipe(dir), EXIT_MS);
    },
    [onSwipe],
  );

  useEffect(() => {
    if (!request) return;
    animateOut(request);
  }, [animateOut, request]);

  const resetCard = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setDragging(false);
    dragRef.current = null;
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exit) return;
    dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y, pointerId: e.pointerId };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || exit) return;
    setOffset({
      x: e.clientX - drag.x,
      y: (e.clientY - drag.y) * 0.35,
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || exit) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    setDragging(false);

    const finalX = e.clientX - drag.x;
    if (finalX > SWIPE_THRESHOLD) {
      animateOut("right");
      return;
    }
    if (finalX < -SWIPE_THRESHOLD) {
      animateOut("left");
      return;
    }
    resetCard();
  };

  const rotate = Math.max(-14, Math.min(14, offset.x / 18));
  const likeOpacity = Math.min(1, Math.max(0, offset.x / SWIPE_THRESHOLD));
  const nopeOpacity = Math.min(1, Math.max(0, -offset.x / SWIPE_THRESHOLD));

  let transform = `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`;
  if (exit === "right") transform = "translate(130%, -8%) rotate(18deg)";
  if (exit === "left") transform = "translate(-130%, -8%) rotate(-18deg)";

  return (
    <div className="pop-match-stage">
      <div
        className={`pop-match-card ${dragging ? "is-dragging" : ""} ${exit ? "is-exiting" : ""}`}
        style={{ transform }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="pop-match-stamp pop-match-stamp-like" style={{ opacity: likeOpacity }} aria-hidden="true">
          LIKE
        </span>
        <span className="pop-match-stamp pop-match-stamp-nope" style={{ opacity: nopeOpacity }} aria-hidden="true">
          NOPE
        </span>

        <div className="pop-match-card-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt={profile.nameJa} className="pop-match-card-photo" draggable={false} />
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
      <p className="pop-match-hint">左右にスワイプ</p>
    </div>
  );
}
