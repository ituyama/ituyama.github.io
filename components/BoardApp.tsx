"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createReply,
  createThread,
  fetchThread,
  fetchThreads,
  formatBoardDateTime,
  formatBoardRelative,
  readBoardName,
  writeBoardName,
  type BoardReply,
  type BoardThread,
  type BoardThreadSummary,
} from "@/lib/board";

function useBoardName() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(readBoardName());
  }, []);

  const updateName = useCallback((value: string) => {
    setName(value);
    writeBoardName(value);
  }, []);

  return [name, updateName] as const;
}

function CharCount({ value, max }: { value: string; max: number }) {
  const left = max - value.length;
  return (
    <span className={`pop-board-count ${left < 80 ? "is-warn" : ""}`} aria-live="polite">
      残り {left} 文字
    </span>
  );
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="pop-board-field" htmlFor={id}>
      <span className="pop-board-label-row">
        <span className="pop-board-label">{label}</span>
        {hint ? <span className="pop-board-hint">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function ListSkeleton() {
  return (
    <div className="pop-board-skeleton" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="pop-board-skeleton-row" />
      ))}
    </div>
  );
}

function ThreadSkeleton() {
  return (
    <div className="pop-board-skeleton pop-board-skeleton-thread" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`pop-board-skeleton-post ${i % 2 ? "is-right" : ""}`} />
      ))}
    </div>
  );
}

function ThreadList({
  threads,
  loading,
  activeId,
  query,
  onQueryChange,
  onRefresh,
  refreshing,
  onOpen,
  onCompose,
}: {
  threads: BoardThreadSummary[];
  loading: boolean;
  activeId: number | null;
  query: string;
  onQueryChange: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  onOpen: (id: number) => void;
  onCompose: () => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(q) || thread.name.toLowerCase().includes(q),
    );
  }, [query, threads]);

  return (
    <section className="pop-board-panel pop-board-side">
      <div className="pop-board-toolbar">
        <h2 className="pop-board-title">スレッド</h2>
        <div className="pop-board-toolbar-actions">
          <button
            type="button"
            className="pop-board-icon-btn"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="一覧を更新"
          >
            <i className={`bi bi-arrow-clockwise ${refreshing ? "is-spin" : ""}`} aria-hidden="true" />
          </button>
          <button type="button" className="pop-btn" onClick={onCompose}>
            ＋ 新規
          </button>
        </div>
      </div>

      <input
        type="search"
        className="pop-board-search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="タイトル・名前で検索"
        aria-label="スレッドを検索"
      />

      {loading ? <ListSkeleton /> : null}
      {!loading && filtered.length === 0 ? (
        <p className="pop-board-muted">
          {threads.length === 0 ? "まだスレッドがありません。" : "該当するスレッドがありません。"}
        </p>
      ) : null}

      <ul className="pop-board-list">
        {filtered.map((thread) => (
          <li key={thread.id}>
            <button
              type="button"
              className={`pop-board-row ${activeId === thread.id ? "is-active" : ""}`}
              onClick={() => onOpen(thread.id)}
            >
              <span className="pop-board-row-top">
                <span className="pop-board-row-title">{thread.title}</span>
                <span className="pop-board-badge">{thread.replyCount}</span>
              </span>
              <span className="pop-board-row-meta">
                <span>{thread.name}</span>
                <time dateTime={new Date(thread.bumpedAt).toISOString()} title={formatBoardDateTime(thread.bumpedAt)}>
                  {formatBoardRelative(thread.bumpedAt)}
                </time>
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
    <article className={`pop-board-post is-${align}`} id={`res-${num}`}>
      <header className="pop-board-post-head">
        <span className="pop-board-post-num">{num}</span>
        <strong className="pop-board-post-name">{name}</strong>
        <time
          className="pop-board-post-time"
          dateTime={new Date(createdAt).toISOString()}
          title={formatBoardDateTime(createdAt)}
        >
          {formatBoardRelative(createdAt)}
        </time>
      </header>
      <p className="pop-board-post-body">{body}</p>
    </article>
  );
}

function submitOnModEnter(event: KeyboardEvent<HTMLTextAreaElement>, form: HTMLFormElement | null) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    form?.requestSubmit();
  }
}

function ThreadPane({
  thread,
  replies,
  loading,
  submitting,
  error,
  savedName,
  onNameChange,
  onBack,
  onSubmitReply,
  onRefresh,
  refreshing,
}: {
  thread: BoardThread | null;
  replies: BoardReply[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  savedName: string;
  onNameChange: (value: string) => void;
  onBack?: () => void;
  onSubmitReply: (name: string, body: string) => Promise<void>;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [name, setName] = useState(savedName);
  const [body, setBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  useEffect(() => {
    if (!loading && thread) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      bodyRef.current?.focus();
    }
  }, [loading, thread, replies.length]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onNameChange(name);
    await onSubmitReply(name, body);
    setBody("");
  };

  if (loading || !thread) {
    return <ThreadSkeleton />;
  }

  const total = replies.length + 1;

  return (
    <div className="pop-board-main-inner">
      <div className="pop-board-toolbar pop-board-toolbar-thread">
        {onBack ? (
          <button type="button" className="pop-btn pop-btn-ghost pop-board-back" onClick={onBack}>
            ← 一覧
          </button>
        ) : null}
        <div className="pop-board-thread-head">
          <h2 className="pop-board-title">{thread.title}</h2>
          <p className="pop-board-thread-meta">{total} レス · 最終更新 {formatBoardRelative(thread.bumpedAt)}</p>
        </div>
        <button
          type="button"
          className="pop-board-icon-btn"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="スレッドを更新"
        >
          <i className={`bi bi-arrow-clockwise ${refreshing ? "is-spin" : ""}`} aria-hidden="true" />
        </button>
      </div>

      <div ref={scrollRef} className="pop-board-thread">
        <PostCard num={1} name={thread.name} body={thread.body} createdAt={thread.createdAt} align="left" />
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
        <div ref={bottomRef} className="pop-board-thread-end" aria-hidden="true" />
      </div>

      <form ref={formRef} className="pop-board-form pop-board-form-sticky" onSubmit={handleSubmit}>
        <div className="pop-board-form-head">
          <h3 className="pop-board-form-title">返信する</h3>
          <span className="pop-board-hint">⌘/Ctrl + Enter で送信</span>
        </div>
        {error ? <p className="pop-board-error">{error}</p> : null}
        <Field label="名前" id="reply-name" hint="次回も使う">
          <input
            id="reply-name"
            className="pop-board-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名無し"
            maxLength={32}
            autoComplete="nickname"
          />
        </Field>
        <Field label="本文" id="reply-body">
          <textarea
            ref={bodyRef}
            id="reply-body"
            className="pop-board-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => submitOnModEnter(e, formRef.current)}
            required
            maxLength={2000}
            rows={4}
            placeholder="返信を入力"
          />
          <CharCount value={body} max={2000} />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting || !body.trim()}>
          {submitting ? "送信中…" : "返信する"}
        </button>
      </form>
    </div>
  );
}

function ComposePane({
  submitting,
  error,
  savedName,
  onNameChange,
  onBack,
  onSubmit,
}: {
  submitting: boolean;
  error: string | null;
  savedName: string;
  onNameChange: (value: string) => void;
  onBack?: () => void;
  onSubmit: (title: string, name: string, body: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState(savedName);
  const [body, setBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onNameChange(name);
    await onSubmit(title, name, body);
  };

  return (
    <div className="pop-board-main-inner is-compose-only">
      <div className="pop-board-toolbar">
        {onBack ? (
          <button type="button" className="pop-btn pop-btn-ghost pop-board-back" onClick={onBack}>
            ← 一覧
          </button>
        ) : null}
        <h2 className="pop-board-title">新規スレッド</h2>
      </div>

      <form ref={formRef} className="pop-board-form is-compose" onSubmit={handleSubmit}>
        {error ? <p className="pop-board-error">{error}</p> : null}
        <Field label="タイトル" id="thread-title">
          <input
            id="thread-title"
            className="pop-board-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
            placeholder="スレッドタイトル"
            autoFocus
          />
          <CharCount value={title} max={80} />
        </Field>
        <Field label="名前" id="thread-name" hint="次回も使う">
          <input
            id="thread-name"
            className="pop-board-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名無し"
            maxLength={32}
            autoComplete="nickname"
          />
        </Field>
        <Field label="本文" id="thread-body">
          <textarea
            id="thread-body"
            className="pop-board-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => submitOnModEnter(e, formRef.current)}
            required
            maxLength={2000}
            rows={8}
            placeholder="最初の投稿"
          />
          <CharCount value={body} max={2000} />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting || !title.trim() || !body.trim()}>
          {submitting ? "送信中…" : "スレッドを立てる"}
        </button>
      </form>
    </div>
  );
}

function EmptyPane({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="pop-board-empty">
      <p className="pop-board-empty-title">スレッドを選択</p>
      <p className="pop-board-muted">左の一覧から選ぶか、新しいスレッドを作成してください。</p>
      <button type="button" className="pop-btn" onClick={onCompose}>
        ＋ 新規スレッド
      </button>
    </div>
  );
}

export default function BoardApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("t");
  const isCompose = searchParams.get("new") === "1";
  const [savedName, setSavedName] = useBoardName();
  const [query, setQuery] = useState("");

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
  const [refreshingList, setRefreshingList] = useState(false);
  const [refreshingThread, setRefreshingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [mainError, setMainError] = useState<string | null>(null);

  const loadThreads = useCallback(async (silent = false) => {
    if (silent) setRefreshingList(true);
    else setLoadingList(true);
    setListError(null);
    try {
      setThreads(await fetchThreads());
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "一覧の読み込みに失敗しました");
    } finally {
      if (silent) setRefreshingList(false);
      else setLoadingList(false);
    }
  }, []);

  const loadThread = useCallback(async (id: number, silent = false) => {
    if (silent) setRefreshingThread(true);
    else setLoadingThread(true);
    setMainError(null);
    try {
      const data = await fetchThread(id);
      setThread(data.thread);
      setReplies(data.replies);
    } catch (cause) {
      setMainError(cause instanceof Error ? cause.message : "スレッドの読み込みに失敗しました");
      setThread(null);
      setReplies([]);
    } finally {
      if (silent) setRefreshingThread(false);
      else setLoadingThread(false);
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

  useEffect(() => {
    if (isCompose || threadId || threads.length === 0) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    router.replace(`/board?t=${threads[0].id}`);
  }, [isCompose, router, threadId, threads]);

  const goList = () => router.push("/board");
  const goThread = (id: number) => router.push(`/board?t=${id}`);
  const goCompose = () => router.push("/board?new=1");

  const handleCreateThread = async (title: string, name: string, body: string) => {
    setSubmitting(true);
    setMainError(null);
    try {
      const id = await createThread({ title, name: name || undefined, body });
      await loadThreads(true);
      router.push(`/board?t=${id}`);
    } catch (cause) {
      setMainError(cause instanceof Error ? cause.message : "投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (name: string, body: string) => {
    if (!threadId) return;
    setSubmitting(true);
    setMainError(null);
    try {
      await createReply(threadId, { name: name || undefined, body });
      await Promise.all([loadThread(threadId, true), loadThreads(true)]);
    } catch (cause) {
      setMainError(cause instanceof Error ? cause.message : "返信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pop-board">
      <header className="pop-board-hero">
        <p className="pop-board-kicker">BOARD</p>
        <h1 className="pop-board-mark">掲示板</h1>
        <p className="pop-board-lead">名前は自動保存。返信は ⌘/Ctrl + Enter でも送信できます。</p>
      </header>

      <div className={`pop-board-shell ${hasMain ? "has-main" : ""}`}>
        <ThreadList
          threads={threads}
          loading={loadingList}
          activeId={threadId}
          query={query}
          onQueryChange={setQuery}
          onRefresh={() => void loadThreads(true)}
          refreshing={refreshingList}
          onOpen={goThread}
          onCompose={goCompose}
        />

        <section className="pop-board-panel pop-board-main">
          {isCompose ? (
            <ComposePane
              submitting={submitting}
              error={mainError}
              savedName={savedName}
              onNameChange={setSavedName}
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
              error={mainError}
              savedName={savedName}
              onNameChange={setSavedName}
              onBack={hasMain ? goList : undefined}
              onSubmitReply={handleCreateReply}
              onRefresh={() => threadId && void loadThread(threadId, true)}
              refreshing={refreshingThread}
            />
          ) : null}

          {!isCompose && !threadId ? <EmptyPane onCompose={goCompose} /> : null}
        </section>
      </div>

      {listError ? (
        <p className="pop-board-error pop-board-error-block">
          {listError}{" "}
          <button type="button" className="pop-board-link-btn" onClick={() => void loadThreads()}>
            再試行
          </button>
        </p>
      ) : null}
    </div>
  );
}
