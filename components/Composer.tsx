"use client";

import { useState } from "react";

const SUGGESTIONS = [
  "スキルを教えて",
  "どんな人？",
  "連絡したい",
  "GitHub を見せて",
];

export default function Composer({
  onSubmit,
  loading,
}: {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(text: string) {
    const v = text.trim();
    if (!v || loading) return;
    onSubmit(v);
    setValue("");
  }

  return (
    <div className="sticky bottom-3 z-10 mx-auto w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-2 rounded-full border border-bento-line bg-bento-surface p-1.5 pl-4 focus-within:border-bento-line-strong"
      >
        <i className="bi bi-search text-[0.9rem] text-bento-muted" aria-hidden="true" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="山野について何でも聞いてください…"
          aria-label="質問を入力"
          maxLength={500}
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent text-[0.85rem] text-bento-ink outline-none placeholder:text-bento-muted"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          aria-label="送信"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bento-ink text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          {loading ? (
            <i className="bi bi-arrow-repeat animate-spin" aria-hidden="true" />
          ) : (
            <i className="bi bi-arrow-up" aria-hidden="true" />
          )}
        </button>
      </form>

      <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            disabled={loading}
            className="rounded-full border border-bento-line bg-bento-surface px-3 py-1 text-[0.7rem] font-medium text-bento-soft disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
