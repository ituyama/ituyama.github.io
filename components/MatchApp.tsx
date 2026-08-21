"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { match } from "@/lib/match";
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
  const subject = encodeURIComponent(match.mailto.subject);
  const body = encodeURIComponent(match.mailto.body);
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
            {match.title}
          </span>
          <button type="button" className="pop-match-close" onClick={onClose} aria-label={match.actions.close}>
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
        <p className="pop-match-kicker">{match.matched.kicker}</p>
        <h3 className="pop-match-title">{match.matched.title}</h3>
        <div className="pop-match-pair">
          <div className="pop-match-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar} alt="" className="pop-match-avatar" />
            <span className="pop-match-avatar-label">{match.viewerLabel}</span>
          </div>
          <span className="pop-match-heart" aria-hidden="true">
            ♥
          </span>
          <div className="pop-match-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={match.photos[0] ?? profile.avatar} alt="" className="pop-match-avatar" />
            <span className="pop-match-avatar-label">{profile.nameJa}</span>
          </div>
        </div>
        <p className="pop-match-copy">{match.matched.copy}</p>
        <div className="pop-match-actions pop-match-actions-stack">
          <a href={mailtoMatch()} className="pop-btn pop-match-btn-primary">
            <i className="bi bi-chat-heart-fill" aria-hidden="true" />
            {match.matched.messageCta}
          </a>
          <button type="button" className="pop-btn pop-match-btn-ghost" onClick={onClose}>
            {match.matched.closeCta}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "nope") {
    return (
      <div className="pop-match-panel">
        <p className="pop-match-kicker">{match.nope.kicker}</p>
        <h3 className="pop-match-title">{match.nope.title}</h3>
        <p className="pop-match-copy">{match.nope.copy}</p>
        <div className="pop-match-actions pop-match-actions-stack">
          <button type="button" className="pop-btn" onClick={() => setPhase("card")}>
            {match.nope.retryCta}
          </button>
          <button type="button" className="pop-btn pop-match-btn-ghost" onClick={onClose}>
            {match.nope.closeCta}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pop-match-body">
      <SwipeableCard age={age} request={swipeRequest} onSwipe={finishSwipe} />
      <div className="pop-match-actions">
        <button
          type="button"
          className="pop-match-action pop-match-action-nope"
          aria-label={match.actions.nope}
          onClick={() => setSwipeRequest("left")}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pop-match-action pop-match-action-like"
          aria-label={match.actions.like}
          onClick={() => setSwipeRequest("right")}
        >
          <i className="bi bi-heart-fill" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

const PHOTO_SWIPE_THRESHOLD = 42;

function MatchPhotos({
  name,
  age,
  location,
}: {
  name: string;
  age: number | null;
  location: string;
}) {
  const photos = match.photos;
  const [index, setIndex] = useState(0);
  const dragRef = useRef<{ x: number; pointerId: number } | null>(null);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(photos.length - 1, i + 1));

  const onPhotoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, pointerId: e.pointerId };
    e.stopPropagation();
  };

  const onPhotoPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    e.stopPropagation();

    const delta = e.clientX - drag.x;
    if (delta > PHOTO_SWIPE_THRESHOLD) goPrev();
    else if (delta < -PHOTO_SWIPE_THRESHOLD) goNext();
  };

  return (
    <div
      className="pop-match-card-media"
      onPointerDown={onPhotoPointerDown}
      onPointerUp={onPhotoPointerUp}
      onPointerCancel={onPhotoPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[index]} alt={`${name} ${index + 1}/${photos.length}`} className="pop-match-card-photo" draggable={false} />
      <div className="pop-match-photo-dots" aria-hidden="true">
        {photos.map((_, i) => (
          <span key={i} className={`pop-match-photo-dot ${i === index ? "is-on" : ""}`} />
        ))}
      </div>
      <button
        type="button"
        className="pop-match-photo-hit pop-match-photo-hit-prev"
        aria-label={match.actions.photoPrev}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
      />
      <button
        type="button"
        className="pop-match-photo-hit pop-match-photo-hit-next"
        aria-label={match.actions.photoNext}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
      />
      <div className="pop-match-card-gradient" aria-hidden="true" />
      <div className="pop-match-card-copy">
        <p className="pop-match-card-name">
          {name}
          {age != null ? `, ${age}` : ""}
        </p>
        {location ? <p className="pop-match-card-meta">{location}</p> : null}
        {profile.tagline ? <p className="pop-match-card-tagline">{profile.tagline}</p> : null}
        <div className="pop-match-card-tags">
          {profile.roles.map((role) => (
            <span key={role} className="pop-chip pop-chip-on-photo">
              {role}
            </span>
          ))}
        </div>
        <p className="pop-match-card-bio">{match.bio}</p>
      </div>
    </div>
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
          {match.stamps.like}
        </span>
        <span className="pop-match-stamp pop-match-stamp-nope" style={{ opacity: nopeOpacity }} aria-hidden="true">
          {match.stamps.nope}
        </span>

        <MatchPhotos name={profile.nameJa} age={age} location={profile.location} />
      </div>
      <p className="pop-match-hint">{match.hint}</p>
    </div>
  );
}
