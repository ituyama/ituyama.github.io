"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

const SUGGESTIONS = ["何してる人？", "スキルは？", "どこにいる？", "連絡したい"];

export default function TalkSection() {
  const logRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } =
    useChat({
      api: "/api/talk",
      initialMessages: [
        {
          id: "hello",
          role: "assistant",
          content: "山野イツキです。仕事の話でも、どうでもいい話でも。",
        },
      ],
    });

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const showChips = messages.length <= 1 && !isLoading;

  return (
    <section
      id="talk"
      className="scroll-mt-10 border-t-2 border-bento-line bg-white md:pl-[72px]"
      aria-labelledby="talk-title"
    >
      <div className="mx-auto grid max-w-[1120px] items-end gap-8 px-[clamp(0.85rem,3vw,1.75rem)] py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:py-14">
        <div>
          <h2
            id="talk-title"
            className="font-lineseed text-[clamp(2.6rem,8vw,4rem)] font-extrabold leading-[0.88] tracking-tight text-bento-ink"
          >
            話そう
          </h2>
          <p className="mt-4 max-w-sm text-[0.95rem] font-extrabold leading-snug text-bento-ink">
            所属でも、スキルでも、どうでもいいことでも。短く返します。
          </p>
        </div>

        <div className="pop-frame flex min-h-[22rem] flex-col">
          <div
            ref={logRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((m) => (
              <p
                key={m.id}
                className={`max-w-[92%] whitespace-pre-wrap border-2 border-bento-line px-3.5 py-2.5 text-[0.9rem] font-bold leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto rounded-[18px_18px_4px_18px] bg-bento-accent text-bento-ink"
                    : "rounded-[18px_18px_18px_4px] bg-white text-bento-ink"
                }`}
              >
                {m.content}
              </p>
            ))}
            {isLoading && messages.at(-1)?.role === "user" ? (
              <p className="w-fit rounded-[18px_18px_18px_4px] border-2 border-bento-line bg-white px-3.5 py-2.5 text-[0.9rem] font-extrabold text-bento-muted">
                …
              </p>
            ) : null}
            {error ? (
              <p className="text-[0.8rem] font-bold text-bento-muted">
                いまは返せません。もう一度どうぞ。
              </p>
            ) : null}
          </div>

          {showChips ? (
            <div className="flex flex-wrap gap-1.5 border-t-2 border-bento-line px-3 py-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => append({ role: "user", content: s })}
                  className="pop-chip pop-chip-ghost"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="flex items-stretch border-t-2 border-bento-line"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="なんでも聞いてください"
              aria-label="メッセージ"
              maxLength={500}
              disabled={isLoading}
              className="min-w-0 flex-1 bg-white px-4 py-3.5 text-[0.9rem] font-bold text-bento-ink outline-none placeholder:font-bold placeholder:text-bento-muted disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="border-l-2 border-bento-line bg-bento-accent px-5 text-[0.82rem] font-extrabold text-bento-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              {isLoading ? "…" : "送る"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
