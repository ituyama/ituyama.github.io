"use client";

import { useState, FormEvent } from "react";

type ContactFormProps = {
  org: string;
  role: string;
  email?: string;
  url?: string;
};

function getClientInfo() {
  if (typeof window === "undefined") {
    return {
      timezone: null,
      screenResolution: null,
      language: null,
      platform: null,
      cookieEnabled: null,
    };
  }

  const nav = navigator as Navigator & {
    userAgentData?: {
      brands: Array<{ brand: string; version: string }>;
      mobile: boolean;
      platform: string;
    };
  };

  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    userAgentData: nav.userAgentData
      ? {
          brands: nav.userAgentData.brands,
          mobile: nav.userAgentData.mobile,
          platform: nav.userAgentData.platform,
        }
      : null,
  };
}

export default function ContactForm({ org, role, email, url }: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const clientInfo = getClientInfo();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: {
            ...formData,
            org,
            role,
            targetEmail: email,
            targetUrl: url,
          },
          clientInfo,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "送信が完了しました。ありがとうございます。",
        });
        setFormData({ name: "", email: "", company: "", message: "" });
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus({ type: null, message: "" });
        }, 3000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "送信に失敗しました。",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "送信に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasExternalLink = url && !email;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="pop-btn pop-work-link mt-5 w-fit"
      >
        <i className="bi bi-envelope-fill" aria-hidden="true" />
        応募する
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="pop-frame relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-2xl leading-none hover:opacity-70"
              aria-label="閉じる"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-2 font-lineseed">
              {org} - {role}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              以下のフォームに入力して送信してください。
            </p>

            {hasExternalLink && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm">
                  外部サイトでの応募も可能です：{" "}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {url}
                  </a>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  お名前 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  メールアドレス <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">
                  会社名・所属
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  メッセージ <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {submitStatus.type && (
                <div
                  className={`p-4 rounded ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "送信中..." : "送信する"}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-6">
              ※
              このフォームを送信すると、IPアドレス、ブラウザ情報、端末情報などが自動的に記録されます。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
