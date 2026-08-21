"use client";

import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BOARD_LABELS,
  BOARD_SORTS,
  createReply,
  createThread,
  fetchThread,
  fetchThreads,
  formatBoardDateTime,
  formatBoardRelative,
  getBoardLabel,
  getThreadHeat,
  heatLabel,
  linkifySegment,
  readBoardName,
  splitPostBody,
  writeBoardName,
  type BoardHeat,
  type BoardLabel,
  type BoardReply,
  type BoardSort,
  type BoardThread,
  type BoardThreadSummary,
} from "@/lib/board";

const POLL_MS = 20_000;

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

function LabelChip({
  label,
  active = false,
  compact = false,
  onClick,
}: {
  label: BoardLabel;
  active?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  const meta = getBoardLabel(label);
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      className={`pop-board-label-chip is-${label} ${active ? "is-active" : ""} ${compact ? "is-compact" : ""}`}
      onClick={onClick}
    >
      {label === "live" ? <span className="pop-board-live-dot" aria-hidden="true" /> : null}
      {meta.name}
    </Tag>
  );
}

function HeatBadge({ heat }: { heat: BoardHeat | null }) {
  const text = heatLabel(heat);
  if (!text) return null;
  return <span className={`pop-board-heat is-${heat}`}>{text}</span>;
}

function PostBody({ body }: { body: string }) {
  const lines = splitPostBody(body);

  return (
    <div className="pop-board-post-body">
      {lines.map((line, lineIndex) => (
        <p key={lineIndex} className="pop-board-post-line">
          {line.length === 0 ? (
            <br />
          ) : (
            linkifySegment(line).map((part, partIndex) =>
              typeof part === "string" ? (
                <Fragment key={partIndex}>{part}</Fragment>
              ) : (
                <a key={partIndex} href={part.href} target="_blank" rel="noopener noreferrer">
                  {part.text}
                </a>
              ),
            )
          )}
        </p>
      ))}
    </div>
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
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="pop-board-skeleton-post" />
      ))}
    </div>
  );
}

function BoardControls({
  sort,
  labelFilter,
  onSortChange,
  onLabelChange,
}: {
  sort: BoardSort;
  labelFilter: BoardLabel | "all";
  onSortChange: (sort: BoardSort) => void;
  onLabelChange: (label: BoardLabel | "all") => void;
}) {
  return (
    <div className="pop-board-controls">
      <div className="pop-board-sort" role="tablist" aria-label="並び替え">
        {BOARD_SORTS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={sort === item.id}
            className={`pop-board-sort-btn ${sort === item.id ? "is-active" : ""}`}
            onClick={() => onSortChange(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="pop-board-filter" aria-label="ラベルで絞り込み">
        <button
          type="button"
          className={`pop-board-filter-btn ${labelFilter === "all" ? "is-active" : ""}`}
          onClick={() => onLabelChange("all")}
        >
          すべて
        </button>
        {BOARD_LABELS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pop-board-filter-btn is-${item.id} ${labelFilter === item.id ? "is-active" : ""}`}
            onClick={() => onLabelChange(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThreadRowButton({
  thread,
  active,
  compact = false,
  onOpen,
}: {
  thread: BoardThreadSummary;
  active: boolean;
  compact?: boolean;
  onOpen: (id: number) => void;
}) {
  const heat = getThreadHeat(thread);

  return (
    <button
      type="button"
      className={`pop-board-row ${active ? "is-active" : ""} ${compact ? "is-compact" : ""}`}
      onClick={() => onOpen(thread.id)}
    >
      <span className="pop-board-row-top">
        <LabelChip label={thread.label} compact />
        <span className="pop-board-row-title">{thread.title}</span>
        <span className="pop-board-badge">{thread.replyCount}</span>
      </span>
      {!compact && thread.excerpt ? <span className="pop-board-row-excerpt">{thread.excerpt}</span> : null}
      <span className="pop-board-row-meta">
        <span>{thread.name}</span>
        <HeatBadge heat={heat} />
        <time dateTime={new Date(thread.bumpedAt).toISOString()} title={formatBoardDateTime(thread.bumpedAt)}>
          {formatBoardRelative(thread.bumpedAt)}
        </time>
      </span>
    </button>
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
        thread.title.toLowerCase().includes(q) ||
        thread.name.toLowerCase().includes(q) ||
        thread.excerpt.toLowerCase().includes(q),
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
        placeholder="タイトル・本文で検索"
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
            <ThreadRowButton thread={thread} active={activeId === thread.id} compact onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeedPane({
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
  if (loading) return <ListSkeleton />;

  if (threads.length === 0) {
    return (
      <div className="pop-board-empty">
        <p className="pop-board-empty-title">最初のスレッドを立てよう</p>
        <p className="pop-board-muted">雑談・質問・議論・実況 — 用途に合わせて書き込めます。</p>
        <button type="button" className="pop-btn" onClick={onCompose}>
          ＋ 新規スレッド
        </button>
      </div>
    );
  }

  return (
    <div className="pop-board-feed">
      {threads.map((thread) => (
        <button key={thread.id} type="button" className="pop-board-feed-card" onClick={() => onOpen(thread.id)}>
          <div className="pop-board-feed-head">
            <LabelChip label={thread.label} />
            <HeatBadge heat={getThreadHeat(thread)} />
            <span className="pop-board-badge">{thread.replyCount} レス</span>
          </div>
          <h3 className="pop-board-feed-title">{thread.title}</h3>
          <p className="pop-board-feed-excerpt">{thread.excerpt}</p>
          <p className="pop-board-feed-meta">
            <span>{thread.name}</span>
            <time dateTime={new Date(thread.bumpedAt).toISOString()} title={formatBoardDateTime(thread.bumpedAt)}>
              更新 {formatBoardRelative(thread.bumpedAt)}
            </time>
          </p>
        </button>
      ))}
    </div>
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
    <article className={`pop-board-post ${isOp ? "is-op" : "is-res"}`} id={`res-${num}`}>
      <header className="pop-board-post-head">
        <a className="pop-board-post-num" href={`#res-${num}`}>
          {num}
        </a>
        <strong className="pop-board-post-name">{name}</strong>
        {isOp ? <span className="pop-board-post-tag">OP</span> : null}
        <time
          className="pop-board-post-time"
          dateTime={new Date(createdAt).toISOString()}
          title={formatBoardDateTime(createdAt)}
        >
          {formatBoardRelative(createdAt)}
        </time>
      </header>
      <PostBody body={body} />
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
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const prevReplyCount = useRef(0);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  useEffect(() => {
    if (!loading && thread) {
      if (replies.length > prevReplyCount.current) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      prevReplyCount.current = replies.length;
    }
  }, [loading, thread, replies.length]);

  useEffect(() => {
    if (!loading && thread) bodyRef.current?.focus();
  }, [loading, thread?.id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onNameChange(name);
    await onSubmitReply(name, body);
    setBody("");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (loading || !thread) {
    return <ThreadSkeleton />;
  }

  const total = replies.length + 1;
  const labelMeta = getBoardLabel(thread.label);

  return (
    <div className="pop-board-main-inner">
      <div className="pop-board-toolbar pop-board-toolbar-thread">
        {onBack ? (
          <button type="button" className="pop-btn pop-btn-ghost pop-board-back" onClick={onBack}>
            ← 一覧
          </button>
        ) : null}
        <div className="pop-board-thread-head">
          <div className="pop-board-thread-labels">
            <LabelChip label={thread.label} />
            <HeatBadge heat={getThreadHeat(thread)} />
          </div>
          <h2 className="pop-board-title">{thread.title}</h2>
          <p className="pop-board-thread-meta">
            {total} レス · {labelMeta.hint} · 最終更新 {formatBoardRelative(thread.bumpedAt)}
          </p>
        </div>
        <div className="pop-board-toolbar-actions">
          <button type="button" className="pop-board-icon-btn" onClick={handleCopyLink} aria-label="リンクをコピー">
            <i className={`bi ${copied ? "bi-check-lg" : "bi-link-45deg"}`} aria-hidden="true" />
          </button>
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
      </div>

      <div className="pop-board-thread">
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
        <div ref={bottomRef} className="pop-board-thread-end" aria-hidden="true" />
      </div>

      <form ref={formRef} className="pop-board-form pop-board-form-sticky" onSubmit={handleSubmit}>
        <div className="pop-board-form-head">
          <h3 className="pop-board-form-title">返信する</h3>
          <span className="pop-board-hint">⌘/Ctrl + Enter · 20秒ごとに自動更新</span>
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
  onSubmit: (title: string, name: string, body: string, label: BoardLabel) => Promise<void>;
}) {
  const [label, setLabel] = useState<BoardLabel>("chat");
  const [title, setTitle] = useState("");
  const [name, setName] = useState(savedName);
  const [body, setBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const labelMeta = getBoardLabel(label);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onNameChange(name);
    await onSubmit(title, name, body, label);
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
        <fieldset className="pop-board-label-picker">
          <legend className="pop-board-label">ラベル</legend>
          <div className="pop-board-label-picker-grid">
            {BOARD_LABELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`pop-board-label-option is-${item.id} ${label === item.id ? "is-active" : ""}`}
                onClick={() => setLabel(item.id)}
              >
                <span className="pop-board-label-option-name">{item.name}</span>
                <span className="pop-board-label-option-hint">{item.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <Field label="タイトル" id="thread-title">
          <input
            id="thread-title"
            className="pop-board-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
            placeholder={`${labelMeta.name}スレッドのタイトル`}
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
            placeholder={labelMeta.placeholder}
          />
          <CharCount value={body} max={2000} />
        </Field>
        <button type="submit" className="pop-btn" disabled={submitting || !title.trim() || !body.trim()}>
          {submitting ? "送信中…" : `${labelMeta.name}スレッドを立てる`}
        </button>
      </form>
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
  const [sort, setSort] = useState<BoardSort>("bumped");
  const [labelFilter, setLabelFilter] = useState<BoardLabel | "all">("all");

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

  const loadThreads = useCallback(
    async (silent = false) => {
      if (silent) setRefreshingList(true);
      else setLoadingList(true);
      setListError(null);
      try {
        setThreads(await fetchThreads({ sort, label: labelFilter }));
      } catch (cause) {
        setListError(cause instanceof Error ? cause.message : "一覧の読み込みに失敗しました");
      } finally {
        if (silent) setRefreshingList(false);
        else setLoadingList(false);
      }
    },
    [labelFilter, sort],
  );

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
    const timer = window.setInterval(() => {
      void loadThreads(true);
      if (threadId && !isCompose) void loadThread(threadId, true);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [isCompose, loadThread, loadThreads, threadId]);

  const goList = () => router.push("/board");
  const goThread = (id: number) => router.push(`/board?t=${id}`);
  const goCompose = () => router.push("/board?new=1");

  const handleCreateThread = async (title: string, name: string, body: string, label: BoardLabel) => {
    setSubmitting(true);
    setMainError(null);
    try {
      const id = await createThread({ title, name: name || undefined, body, label });
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

  const feedThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q),
    );
  }, [query, threads]);

  return (
    <div className="pop-board">
      <header className="pop-board-hero">
        <p className="pop-board-kicker">PARK</p>
        <h1 className="pop-board-mark">ituyama park</h1>
        <p className="pop-board-lead">
          雑談・質問・議論・実況 — 用途別ラベルで書き分け。盛り上がり順ソートと自動更新つき。
        </p>
      </header>

      <BoardControls
        sort={sort}
        labelFilter={labelFilter}
        onSortChange={setSort}
        onLabelChange={setLabelFilter}
      />

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

          {!isCompose && !threadId ? (
            <div className="pop-board-main-inner is-feed">
              <FeedPane
                threads={feedThreads}
                loading={loadingList}
                onOpen={goThread}
                onCompose={goCompose}
              />
            </div>
          ) : null}
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
