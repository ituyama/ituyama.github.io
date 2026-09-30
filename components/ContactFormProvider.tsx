"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  CONTACT_API_PATH,
  type ContactIntent,
  type ContactResponse,
} from "@/lib/contact";

type ContactFormContextValue = {
  openContact: (intent: ContactIntent) => void;
};

const ContactFormContext = createContext<ContactFormContextValue | null>(null);

export function useContactForm() {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("useContactForm must be used within ContactFormProvider");
  return ctx;
}

export default function ContactFormProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<ContactIntent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openContact = useCallback((next: ContactIntent) => {
    setIntent(next);
  }, []);

  const close = useCallback(() => {
    setIntent(null);
  }, []);

  return (
    <ContactFormContext.Provider value={{ openContact }}>
      {children}
      {mounted && intent ? (
        <ContactFormModal intent={intent} onClose={close} />
      ) : null}
    </ContactFormContext.Provider>
  );
}

function ContactFormModal({
  intent,
  onClose,
}: {
  intent: ContactIntent;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(intent.defaultMessage ?? "");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    setMessage(intent.defaultMessage ?? "");
    setStatus("idle");
  }, [intent]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: intent.subject,
          source: intent.source,
          company,
        }),
      });
      const data = (await res.json()) as ContactResponse;
      if (!res.ok || !data.ok) throw new Error(data.error || "send_failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return createPortal(
    <div className="pop-contact-root" role="presentation" onClick={onClose}>
      <div
        className="pop-contact-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="pop-contact-header">
          <h2 id={titleId} className="pop-contact-title">
            お問い合わせ
          </h2>
          <button type="button" className="pop-contact-close" aria-label="閉じる" onClick={onClose}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>

        {status === "sent" ? (
          <div className="pop-contact-body pop-contact-done">
            <p className="pop-contact-done-title">送信しました</p>
            <p className="pop-contact-done-copy">ありがとうございます。内容を確認して返信します。</p>
            <button type="button" className="pop-btn pop-contact-submit" onClick={onClose}>
              閉じる
            </button>
          </div>
        ) : (
          <form className="pop-contact-body" onSubmit={onSubmit}>
            <p id={descId} className="pop-contact-subject">
              {intent.subject}
            </p>
            <label className="pop-contact-field">
              <span>お名前</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="pop-contact-field">
              <span>メールアドレス</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="pop-contact-field">
              <span>メッセージ</span>
              <textarea
                name="message"
                required
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <label className="pop-contact-honeypot" aria-hidden="true">
              <span>Company</span>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </label>
            {status === "error" ? (
              <p className="pop-contact-error" role="alert">
                送信に失敗しました。時間をおいて再度お試しください。
              </p>
            ) : null}
            <button type="submit" className="pop-btn pop-contact-submit" disabled={status === "sending"}>
              <i className="bi bi-envelope-fill" aria-hidden="true" />
              {status === "sending" ? "送信中…" : "送信する"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
