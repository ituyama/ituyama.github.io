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

type View = "list" | "thread" | "compose";

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
  onOpen,
  onCompose,
}: {
  threads: BoardThreadSummary[];
  loading: boolean;
  onOpen: (id: number) => void;
  onCompose: () => void;
}) {
  return (
    <section className="pop-board-panel">
      <div className="pop-board-toolbar">
        <h2 className="pop-board-title">スレッド一覧</h2>
        <button type="button" className="pop-btn" onClick={onCompose}>
          新規スレッド
        </button>
      </div>

      {loading ? <p className="pop-board-muted">読み込み中…</p> : null}
      {!loading && threads.length === 0 ? (
        <p className="pop-board-muted">まだスレッドがありません。最初の投稿をどうぞ。</p>
      ) : null}

      <ul className="pop-board-list">
        {threads.map((thread) => (
          <li key={thread.id}>
            <button type="button" className="pop-board-row" onClick={() => onOpen(thread.id)}>
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
  isOp = false,
}: {
  num: number;
  name: string;
  body: string;
  createdAt: number;
  isOp?: boolean;
}) {
  return (
    <article className={`pop-board-post ${isOp ? "is-op" : ""}`}>
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

function ThreadView({
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
  onBack: () => void;
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
    <section className="pop-board-panel">
      <div className="pop-board-toolbar">
        <button type="button" className="pop-btn pop-btn-ghost" onClick={onBack}>
          ← 一覧へ
        </button>
        <h2 className="pop-board-title">{thread.title}</h2>
      </div>

      <PostCard num={1} name={thread.name} body={thread.body} createdAt={thread.createdAt} isOp />
      {replies.map((reply, index) => (
        <PostCard
          key={reply.id}
          num={index + 2}
          name={reply.name}
          body={reply.body}
          createdAt={reply.createdAt}
        />
      ))}

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
            rows={5}
          />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting}>
          {submitting ? "送信中…" : "返信する"}
        </button>
      </form>
    </section>
  );
}

function ComposeView({
  submitting,
  error,
  onBack,
  onSubmit,
}: {
  submitting: boolean;
  error: string | null;
  onBack: () => void;
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
    <section className="pop-board-panel">
      <div className="pop-board-toolbar">
        <button type="button" className="pop-btn pop-btn-ghost" onClick={onBack}>
          ← 一覧へ
        </button>
        <h2 className="pop-board-title">新規スレッド</h2>
      </div>

      <form className="pop-board-form" onSubmit={handleSubmit}>
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
    </section>
  );
}

export default function BoardApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("t");
  const composeParam = searchParams.get("new") === "1";

  const threadId = useMemo(() => {
    const id = Number(threadParam);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [threadParam]);

  const view: View = composeParam ? "compose" : threadId ? "thread" : "list";

  const [threads, setThreads] = useState<BoardThreadSummary[]>([]);
  const [thread, setThread] = useState<BoardThread | null>(null);
  const [replies, setReplies] = useState<BoardReply[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      setThreads(await fetchThreads());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "読み込みに失敗しました");
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
      setError(cause instanceof Error ? cause.message : "読み込みに失敗しました");
      setThread(null);
      setReplies([]);
    } finally {
      setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    if (view === "list") void loadThreads();
  }, [view, loadThreads]);

  useEffect(() => {
    if (view === "thread" && threadId) void loadThread(threadId);
  }, [view, threadId, loadThread]);

  const goList = () => router.push("/board");
  const goThread = (id: number) => router.push(`/board?t=${id}`);
  const goCompose = () => router.push("/board?new=1");

  const handleCreateThread = async (title: string, name: string, body: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const id = await createThread({ title, name: name || undefined, body });
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
      await loadThread(threadId);
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
        <p className="pop-board-lead">気軽に書き込んでください。名前が空欄の場合は「名無し」になります。</p>
      </header>

      {view === "list" ? (
        <ThreadList
          threads={threads}
          loading={loadingList}
          onOpen={goThread}
          onCompose={goCompose}
        />
      ) : null}

      {view === "thread" ? (
        <ThreadView
          thread={thread}
          replies={replies}
          loading={loadingThread}
          submitting={submitting}
          error={error}
          onBack={goList}
          onSubmitReply={handleCreateReply}
        />
      ) : null}

      {view === "compose" ? (
        <ComposeView
          submitting={submitting}
          error={error}
          onBack={goList}
          onSubmit={handleCreateThread}
        />
      ) : null}

      {view === "list" && error ? <p className="pop-board-error pop-board-error-block">{error}</p> : null}
    </div>
  );
}
