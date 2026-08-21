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
const PHOTO_SWIPE_THRESHOLD = 42;
const PHOTO_TAP_ZONE = 0.34;
const EXIT_MS = 260;

function mailtoMatch() {
  const subject = encodeURIComponent(match.mailto.subject);
  const body = encodeURIComponent(match.mailto.body);
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export default function MatchApp({ open, onClose }: MatchAppProps) {
  const titleId = useId();
  const age = profile.birthday ? calcAge(profile.birthday) : null;
  const [phase, setPhase] = useState<Phase>("card");

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

  useEffect(() => {
    if (!open) setPhase("card");
  }, [open]);

  if (!open) return null;

  const isCelebrate = phase === "matched";

  return (
    <div
      className={`pop-match-root ${isCelebrate ? "is-celebrate" : ""}`}
      role="presentation"
      onClick={isCelebrate ? undefined : onClose}
    >
      {isCelebrate ? (
        <div
          className="pop-match-celebrate-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          <MatchCelebrate onClose={onClose} titleId={titleId} />
        </div>
      ) : (
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

          <MatchFlow age={age} phase={phase} setPhase={setPhase} onClose={onClose} />
        </div>
      )}
    </div>
  );
}

function MatchCelebrate({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  return (
    <div className="pop-match-celebrate" role="status" aria-labelledby={titleId}>
      <div className="pop-match-celebrate-sparkles" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="pop-match-celebrate-spark" style={{ "--spark-i": i } as React.CSSProperties} />
        ))}
      </div>

      <div className="pop-match-celebrate-photos">
        {match.viewerAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={match.viewerAvatar}
            alt=""
            className="pop-match-celebrate-photo pop-match-celebrate-photo-you"
          />
        ) : (
          <div className="pop-match-celebrate-photo pop-match-celebrate-photo-you pop-match-celebrate-photo-placeholder" aria-hidden="true">
            <i className="bi bi-person-fill" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={match.avatar || match.photos[0] || profile.avatar}
          alt={profile.nameJa}
          className="pop-match-celebrate-photo pop-match-celebrate-photo-them"
        />
        <span className="pop-match-celebrate-heart" aria-hidden="true">
          ♥
        </span>
      </div>

      <h2 className="pop-match-celebrate-headline" id={titleId}>
        {match.matched.kicker}
      </h2>
      <p className="pop-match-celebrate-title">{match.matched.title}</p>
      <p className="pop-match-celebrate-copy">{match.matched.copy}</p>

      <div className="pop-match-celebrate-actions">
        <a href={mailtoMatch()} className="pop-match-celebrate-btn pop-match-celebrate-btn-primary">
          <i className="bi bi-chat-heart-fill" aria-hidden="true" />
          {match.matched.messageCta}
        </a>
        <button type="button" className="pop-match-celebrate-btn pop-match-celebrate-btn-secondary" onClick={onClose}>
          {match.matched.closeCta}
        </button>
      </div>
    </div>
  );
}

function MatchFlow({
  age,
  phase,
  setPhase,
  onClose,
}: {
  age: number | null;
  phase: Phase;
  setPhase: (phase: Phase) => void;
  onClose: () => void;
}) {
  const [swipeRequest, setSwipeRequest] = useState<ExitDir | null>(null);

  const finishSwipe = useCallback(
    (dir: ExitDir) => {
      setSwipeRequest(null);
      setPhase(dir === "right" ? "matched" : "nope");
    },
    [setPhase],
  );

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

function MatchPhotos({
  name,
  age,
  photoIndex,
}: {
  name: string;
  age: number | null;
  photoIndex: number;
}) {
  const photos = match.photos;

  return (
    <div className="pop-match-card-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[photoIndex]}
        alt={`${name} ${photoIndex + 1}/${photos.length}`}
        className="pop-match-card-photo"
        draggable={false}
      />
      <div className="pop-match-photo-dots" aria-hidden="true">
        {photos.map((_, i) => (
          <span key={i} className={`pop-match-photo-dot ${i === photoIndex ? "is-on" : ""}`} />
        ))}
      </div>
      <div className="pop-match-card-gradient" aria-hidden="true" />
      <div className="pop-match-card-copy">
        <p className="pop-match-card-name">
          {name}
          {age != null ? <span className="pop-match-card-age">{age}</span> : null}
        </p>
        {match.area ? <p className="pop-match-card-area">{match.area}</p> : null}
        {match.bio ? <p className="pop-match-card-bio">{match.bio}</p> : null}
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
  const photos = match.photos;
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    pointerId: number;
  } | null>(null);
  const exitingRef = useRef(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<ExitDir | null>(null);

  const goPrevPhoto = useCallback(() => {
    setPhotoIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNextPhoto = useCallback(() => {
    setPhotoIndex((i) => Math.min(photos.length - 1, i + 1));
  }, [photos.length]);

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

  const tryPhotoChange = useCallback(
    (dx: number, startX: number) => {
      const absDx = Math.abs(dx);

      if (absDx >= PHOTO_SWIPE_THRESHOLD) {
        if (dx > 0) goPrevPhoto();
        else goNextPhoto();
        return;
      }

      const card = cardRef.current;
      if (!card) return;
      const relX = (startX - card.getBoundingClientRect().left) / card.clientWidth;
      if (relX < PHOTO_TAP_ZONE) goPrevPhoto();
      else if (relX > 1 - PHOTO_TAP_ZONE) goNextPhoto();
    },
    [goNextPhoto, goPrevPhoto],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exit) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
      pointerId: e.pointerId,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || exit) return;
    setOffset({
      x: e.clientX - drag.startX + drag.baseX,
      y: (e.clientY - drag.startY) * 0.35 + drag.baseY,
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || exit) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const dx = e.clientX - drag.startX;
    dragRef.current = null;
    setDragging(false);

    if (dx > SWIPE_THRESHOLD) {
      animateOut("right");
      return;
    }
    if (dx < -SWIPE_THRESHOLD) {
      animateOut("left");
      return;
    }

    tryPhotoChange(dx, drag.startX);
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
        ref={cardRef}
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

        <MatchPhotos name={profile.nameJa} age={age} photoIndex={photoIndex} />
      </div>
      <p className="pop-match-hint">{match.hint}</p>
    </div>
  );
}
