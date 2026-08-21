export type BoardLabel = "chat" | "question" | "discuss" | "live";
export type BoardSort = "bumped" | "created" | "replies";
export type BoardHeat = "hot" | "warm" | "new";

export type BoardThreadSummary = {
  id: number;
  title: string;
  name: string;
  label: BoardLabel;
  excerpt: string;
  replyCount: number;
  createdAt: number;
  bumpedAt: number;
};

export type BoardThread = BoardThreadSummary & {
  body: string;
};

export type BoardReply = {
  id: number;
  name: string;
  body: string;
  createdAt: number;
};

export type CreateThreadInput = {
  title: string;
  name?: string;
  body: string;
  label?: BoardLabel;
};

export type CreateReplyInput = {
  name?: string;
  body: string;
};

export type FetchThreadsOptions = {
  sort?: BoardSort;
  label?: BoardLabel | "all";
};

export const BOARD_LABELS: {
  id: BoardLabel;
  name: string;
  hint: string;
  placeholder: string;
}[] = [
  { id: "chat", name: "雑談", hint: "気軽に話す", placeholder: "近況や思ったことを書いてみて" },
  { id: "question", name: "質問", hint: "答えを集める", placeholder: "困っていること・知りたいことを書いて" },
  { id: "discuss", name: "議論", hint: "意見を交わす", placeholder: "論点と自分の考えを書いて" },
  { id: "live", name: "実況", hint: "今起きていること", placeholder: "今見ている・聞いていることをリアルタイムで" },
];

export const BOARD_SORTS: { id: BoardSort; name: string }[] = [
  { id: "bumped", name: "更新順" },
  { id: "created", name: "新着" },
  { id: "replies", name: "盛り上がり" },
];

const LABEL_SET = new Set<BoardLabel>(BOARD_LABELS.map((item) => item.id));

export function isBoardLabel(value: string): value is BoardLabel {
  return LABEL_SET.has(value as BoardLabel);
}

export function getBoardLabel(id: BoardLabel) {
  return BOARD_LABELS.find((item) => item.id === id) ?? BOARD_LABELS[0];
}

export function getThreadHeat(thread: Pick<BoardThreadSummary, "replyCount" | "bumpedAt" | "createdAt">): BoardHeat | null {
  const bumpAgeH = (Date.now() - thread.bumpedAt) / 3_600_000;
  const createAgeH = (Date.now() - thread.createdAt) / 3_600_000;

  if (thread.replyCount >= 8 && bumpAgeH < 12) return "hot";
  if (thread.replyCount >= 3 && bumpAgeH < 8) return "warm";
  if (createAgeH < 2) return "new";
  return null;
}

export function heatLabel(heat: BoardHeat | null): string | null {
  if (heat === "hot") return "🔥 盛り上がり中";
  if (heat === "warm") return "💬 活発";
  if (heat === "new") return "✨ NEW";
  return null;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) {
    throw new Error(data.error ?? `request failed (${res.status})`);
  }
  return data;
}

export async function fetchThreads(options: FetchThreadsOptions = {}): Promise<BoardThreadSummary[]> {
  const params = new URLSearchParams();
  if (options.sort) params.set("sort", options.sort);
  if (options.label && options.label !== "all") params.set("label", options.label);

  const query = params.toString();
  const res = await fetch(`/api/board/threads${query ? `?${query}` : ""}`);
  const data = await parseJson<{ threads: BoardThreadSummary[] }>(res);
  return data.threads;
}

export async function fetchThread(id: number): Promise<{ thread: BoardThread; replies: BoardReply[] }> {
  const res = await fetch(`/api/board/threads/${id}`);
  return parseJson<{ thread: BoardThread; replies: BoardReply[] }>(res);
}

export async function createThread(input: CreateThreadInput): Promise<number> {
  const res = await fetch("/api/board/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ id: number }>(res);
  return data.id;
}

export async function createReply(threadId: number, input: CreateReplyInput): Promise<number> {
  const res = await fetch(`/api/board/threads/${threadId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ id: number }>(res);
  return data.id;
}

export function formatBoardTime(ms: number): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

export function formatBoardRelative(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 45_000) return "たった今";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return formatBoardTime(ms);
}

export function formatBoardDateTime(ms: number): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,;:!?)}\]"'»])/g;

export function splitPostBody(body: string): string[] {
  return body.replace(/\r\n/g, "\n").split("\n");
}

export function linkifySegment(segment: string): Array<string | { href: string; text: string }> {
  const parts: Array<string | { href: string; text: string }> = [];
  let last = 0;
  for (const match of segment.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(segment.slice(last, index));
    parts.push({ href: match[0], text: match[0] });
    last = index + match[0].length;
  }
  if (last < segment.length) parts.push(segment.slice(last));
  return parts.length ? parts : [segment];
}

const BOARD_NAME_KEY = "ituyama-board-name";

export function readBoardName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(BOARD_NAME_KEY) ?? "";
}

export function writeBoardName(name: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOARD_NAME_KEY, name);
}
