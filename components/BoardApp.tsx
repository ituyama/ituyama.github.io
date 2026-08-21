"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createReply,
  createThread,
  fetchThread,
  fetchThreads,
  formatBoardTime,
  type BoardReply,
  type BoardThread,
  type BoardThreadSummary,
} from "@/lib/board";

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label className="pop-board-field" htmlFor={id}>
      <span className="pop-board-label">{label}</span>
      {children}
    </label>
  );
}

function ThreadList({
  threads,
  loading,
  activeId,
  onOpen,
  onCompose,
}: {
  threads: BoardThreadSummary[];
  loading: boolean;
  activeId: number | null;
  onOpen: (id: number) => void;
  onCompose: () => void;
}) {
  return (
    <section className="pop-board-panel pop-board-side">
      <div className="pop-board-toolbar">
        <h2 className="pop-board-title">スレッド</h2>
        <button type="button" className="pop-btn" onClick={onCompose}>
          ＋ 新規
        </button>
      </div>

      {loading ? <p className="pop-board-muted">読み込み中…</p> : null}
      {!loading && threads.length === 0 ? (
        <p className="pop-board-muted">まだスレッドがありません。</p>
      ) : null}

      <ul className="pop-board-list">
        {threads.map((thread) => (
          <li key={thread.id}>
            <button
              type="button"
              className={`pop-board-row ${activeId === thread.id ? "is-active" : ""}`}
              onClick={() => onOpen(thread.id)}
            >
              <span className="pop-board-row-title">{thread.title}</span>
              <span className="pop-board-row-meta">
                <span>{thread.name}</span>
                <span>{thread.replyCount} レス</span>
                <span>{formatBoardTime(thread.bumpedAt)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PostCard({
  num,
  name,
  body,
  createdAt,
  align,
}: {
  num: number;
  name: string;
  body: string;
  createdAt: number;
  align: "left" | "right";
}) {
  return (
    <article className={`pop-board-post is-${align}`}>
      <header className="pop-board-post-head">
        <span className="pop-board-post-num">{num}</span>
        <strong className="pop-board-post-name">{name}</strong>
        <time className="pop-board-post-time" dateTime={new Date(createdAt).toISOString()}>
          {formatBoardTime(createdAt)}
        </time>
      </header>
      <p className="pop-board-post-body">{body}</p>
    </article>
  );
}

function ThreadPane({
  thread,
  replies,
  loading,
  submitting,
  error,
  onBack,
  onSubmitReply,
}: {
  thread: BoardThread | null;
  replies: BoardReply[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  onBack?: () => void;
  onSubmitReply: (name: string, body: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmitReply(name, body);
    setBody("");
  };

  if (loading || !thread) {
    return <p className="pop-board-muted">読み込み中…</p>;
  }

  return (
    <>
      <div className="pop-board-toolbar pop-board-toolbar-thread">
        {onBack ? (
          <button type="button" className="pop-btn pop-btn-ghost pop-board-back" onClick={onBack}>
            ← 一覧
          </button>
        ) : null}
        <h2 className="pop-board-title">{thread.title}</h2>
      </div>

      <div className="pop-board-thread">
        <PostCard
          num={1}
          name={thread.name}
          body={thread.body}
          createdAt={thread.createdAt}
          align="left"
        />
        {replies.map((reply, index) => (
          <PostCard
            key={reply.id}
            num={index + 2}
            name={reply.name}
            body={reply.body}
            createdAt={reply.createdAt}
            align={index % 2 === 0 ? "right" : "left"}
          />
        ))}
      </div>

      <form className="pop-board-form" onSubmit={handleSubmit}>
        <h3 className="pop-board-form-title">返信する</h3>
        {error ? <p className="pop-board-error">{error}</p> : null}
        <Field label="名前" id="reply-name">
          <input
            id="reply-name"
            className="pop-board-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名無し"
            maxLength={32}
          />
        </Field>
        <Field label="本文" id="reply-body">
          <textarea
            id="reply-body"
            className="pop-board-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={2000}
            rows={4}
          />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting}>
          {submitting ? "送信中…" : "返信する"}
        </button>
      </form>
    </>
  );
}

function ComposePane({
  submitting,
  error,
  onBack,
  onSubmit,
}: {
  submitting: boolean;
  error: string | null;
  onBack?: () => void;
  onSubmit: (title: string, name: string, body: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(title, name, body);
  };

  return (
    <>
      <div className="pop-board-toolbar">
        {onBack ? (
          <button type="button" className="pop-btn pop-btn-ghost pop-board-back" onClick={onBack}>
            ← 一覧
          </button>
        ) : null}
        <h2 className="pop-board-title">新規スレッド</h2>
      </div>

      <form className="pop-board-form is-compose" onSubmit={handleSubmit}>
        {error ? <p className="pop-board-error">{error}</p> : null}
        <Field label="タイトル" id="thread-title">
          <input
            id="thread-title"
            className="pop-board-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
          />
        </Field>
        <Field label="名前" id="thread-name">
          <input
            id="thread-name"
            className="pop-board-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名無し"
            maxLength={32}
          />
        </Field>
        <Field label="本文" id="thread-body">
          <textarea
            id="thread-body"
            className="pop-board-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={2000}
            rows={8}
          />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting}>
          {submitting ? "送信中…" : "スレッドを立てる"}
        </button>
      </form>
    </>
  );
}

function EmptyPane() {
  return (
    <div className="pop-board-empty">
      <p className="pop-board-empty-title">スレッドを選択</p>
      <p className="pop-board-muted">左の一覧からスレッドを選ぶか、新規スレッドを作成してください。</p>
    </div>
  );
}

export default function BoardApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("t");
  const isCompose = searchParams.get("new") === "1";

  const threadId = useMemo(() => {
    const id = Number(threadParam);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [threadParam]);

  const hasMain = isCompose || threadId !== null;

  const [threads, setThreads] = useState<BoardThreadSummary[]>([]);
  const [thread, setThread] = useState<BoardThread | null>(null);
  const [replies, setReplies] = useState<BoardReply[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setLoadingList(true);
    try {
      setThreads(await fetchThreads());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "一覧の読み込みに失敗しました");
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadThread = useCallback(async (id: number) => {
    setLoadingThread(true);
    setError(null);
    try {
      const data = await fetchThread(id);
      setThread(data.thread);
      setReplies(data.replies);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "スレッドの読み込みに失敗しました");
      setThread(null);
      setReplies([]);
    } finally {
      setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (threadId && !isCompose) void loadThread(threadId);
    else {
      setThread(null);
      setReplies([]);
    }
  }, [threadId, isCompose, loadThread]);

  const goList = () => router.push("/board");
  const goThread = (id: number) => router.push(`/board?t=${id}`);
  const goCompose = () => router.push("/board?new=1");

  const handleCreateThread = async (title: string, name: string, body: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const id = await createThread({ title, name: name || undefined, body });
      await loadThreads();
      router.push(`/board?t=${id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (name: string, body: string) => {
    if (!threadId) return;
    setSubmitting(true);
    setError(null);
    try {
      await createReply(threadId, { name: name || undefined, body });
      await Promise.all([loadThread(threadId), loadThreads()]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "返信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pop-board">
      <header className="pop-board-hero">
        <p className="pop-board-kicker">BOARD</p>
        <h1 className="pop-board-mark">掲示板</h1>
        <p className="pop-board-lead">左にスレッド、右にレス。気軽に書き込んでください。</p>
      </header>

      <div className={`pop-board-shell ${hasMain ? "has-main" : ""}`}>
        <ThreadList
          threads={threads}
          loading={loadingList}
          activeId={threadId}
          onOpen={goThread}
          onCompose={goCompose}
        />

        <section className="pop-board-panel pop-board-main">
          {isCompose ? (
            <ComposePane
              submitting={submitting}
              error={error}
              onBack={hasMain ? goList : undefined}
              onSubmit={handleCreateThread}
            />
          ) : null}

          {!isCompose && threadId ? (
            <ThreadPane
              thread={thread}
              replies={replies}
              loading={loadingThread}
              submitting={submitting}
              error={error}
              onBack={hasMain ? goList : undefined}
              onSubmitReply={handleCreateReply}
            />
          ) : null}

          {!isCompose && !threadId ? <EmptyPane /> : null}
        </section>
      </div>

      {!hasMain && error ? <p className="pop-board-error pop-board-error-block">{error}</p> : null}
    </div>
  );
}
