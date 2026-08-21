export type BoardThreadSummary = {
  id: number;
  title: string;
  name: string;
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
};

export type CreateReplyInput = {
  name?: string;
  body: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) {
    throw new Error(data.error ?? `request failed (${res.status})`);
  }
  return data;
}

export async function fetchThreads(): Promise<BoardThreadSummary[]> {
  const res = await fetch("/api/board/threads");
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
