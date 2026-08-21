const MAX_TITLE = 80;
const MAX_NAME = 32;
const MAX_BODY = 2000;
const PAGE_SIZE = 50;

type ThreadRow = {
  id: number;
  title: string;
  name: string;
  body: string;
  label: string;
  created_at: number;
  bumped_at: number;
  reply_count: number;
};

type PostRow = {
  id: number;
  thread_id: number;
  name: string;
  body: string;
  created_at: number;
};

type JsonBody = {
  title?: unknown;
  name?: unknown;
  body?: unknown;
  label?: unknown;
};

function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return Response.json(data, {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function badRequest(message: string, headers: HeadersInit): Response {
  return json({ ok: false, error: message }, 400, headers);
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseName(value: unknown): string {
  const name = clip(value, MAX_NAME);
  return name || "名無し";
}

const VALID_LABELS = new Set(["chat", "question", "discuss", "live"]);
const VALID_SORTS = new Set(["bumped", "created", "replies"]);

function parseLabel(value: unknown): string {
  if (typeof value === "string" && VALID_LABELS.has(value)) return value;
  return "chat";
}

function makeExcerpt(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= 120) return flat;
  return `${flat.slice(0, 120)}…`;
}

function formatThread(row: ThreadRow) {
  return {
    id: row.id,
    title: row.title,
    name: row.name,
    body: row.body,
    label: parseLabel(row.label),
    excerpt: makeExcerpt(row.body),
    replyCount: row.reply_count,
    createdAt: row.created_at * 1000,
    bumpedAt: row.bumped_at * 1000,
  };
}

function formatPost(row: PostRow) {
  return {
    id: row.id,
    name: row.name,
    body: row.body,
    createdAt: row.created_at * 1000,
  };
}

async function listThreads(db: D1Database, url: URL, headers: HeadersInit): Promise<Response> {
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0) || 0);
  const limit = Math.min(PAGE_SIZE, Math.max(1, Number(url.searchParams.get("limit") ?? PAGE_SIZE) || PAGE_SIZE));
  const sort = url.searchParams.get("sort") ?? "bumped";
  const label = url.searchParams.get("label");

  const orderBy =
    sort === "created"
      ? "t.created_at DESC"
      : sort === "replies"
        ? "reply_count DESC, t.bumped_at DESC"
        : "t.bumped_at DESC";

  const filterLabel = label && VALID_LABELS.has(label) ? label : null;
  const where = filterLabel ? "WHERE t.label = ?" : "";

  const statement = db.prepare(
    `SELECT
      t.id, t.title, t.name, t.body, t.label, t.created_at, t.bumped_at,
      (SELECT COUNT(*) FROM posts p WHERE p.thread_id = t.id) AS reply_count
    FROM threads t
    ${where}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?`,
  );

  const { results } = filterLabel
    ? await statement.bind(filterLabel, limit, offset).all<ThreadRow>()
    : await statement.bind(limit, offset).all<ThreadRow>();

  return json(
    {
      ok: true,
      threads: (results ?? []).map((row) => {
        const { body: _body, ...rest } = formatThread(row);
        return rest;
      }),
    },
    200,
    headers,
  );
}

async function getThread(db: D1Database, id: number, headers: HeadersInit): Promise<Response> {
  const thread = await db
    .prepare(
      `SELECT
        t.id, t.title, t.name, t.body, t.label, t.created_at, t.bumped_at,
        (SELECT COUNT(*) FROM posts p WHERE p.thread_id = t.id) AS reply_count
      FROM threads t
      WHERE t.id = ?`,
    )
    .bind(id)
    .first<ThreadRow>();

  if (!thread) return json({ ok: false, error: "not found" }, 404, headers);

  const { results } = await db
    .prepare("SELECT id, thread_id, name, body, created_at FROM posts WHERE thread_id = ? ORDER BY created_at ASC")
    .bind(id)
    .all<PostRow>();

  return json(
    {
      ok: true,
      thread: formatThread(thread),
      replies: (results ?? []).map(formatPost),
    },
    200,
    headers,
  );
}

async function createThread(request: Request, db: D1Database, headers: HeadersInit): Promise<Response> {
  let payload: JsonBody;
  try {
    payload = (await request.json()) as JsonBody;
  } catch {
    return badRequest("invalid json", headers);
  }

  const title = clip(payload.title, MAX_TITLE);
  const body = clip(payload.body, MAX_BODY);
  const name = parseName(payload.name);
  const label = parseLabel(payload.label);

  if (!title) return badRequest("title required", headers);
  if (!body) return badRequest("body required", headers);

  const result = await db
    .prepare("INSERT INTO threads (title, name, body, label) VALUES (?, ?, ?, ?) RETURNING id")
    .bind(title, name, body, label)
    .first<{ id: number }>();

  if (!result) return json({ ok: false, error: "insert failed" }, 500, headers);

  return json({ ok: true, id: result.id }, 201, headers);
}

async function createReply(request: Request, db: D1Database, threadId: number, headers: HeadersInit): Promise<Response> {
  const exists = await db.prepare("SELECT id FROM threads WHERE id = ?").bind(threadId).first();
  if (!exists) return json({ ok: false, error: "not found" }, 404, headers);

  let payload: JsonBody;
  try {
    payload = (await request.json()) as JsonBody;
  } catch {
    return badRequest("invalid json", headers);
  }

  const body = clip(payload.body, MAX_BODY);
  const name = parseName(payload.name);
  if (!body) return badRequest("body required", headers);

  const result = await db
    .prepare("INSERT INTO posts (thread_id, name, body) VALUES (?, ?, ?) RETURNING id")
    .bind(threadId, name, body)
    .first<{ id: number }>();

  if (!result) return json({ ok: false, error: "insert failed" }, 500, headers);

  await db.prepare("UPDATE threads SET bumped_at = unixepoch() WHERE id = ?").bind(threadId).run();

  return json({ ok: true, id: result.id }, 201, headers);
}

export async function handleBoard(
  request: Request,
  env: { DB: D1Database },
  url: URL,
  headers: HeadersInit,
): Promise<Response | null> {
  if (!url.pathname.startsWith("/api/board")) return null;

  const threadMatch = url.pathname.match(/^\/api\/board\/threads\/(\d+)(?:\/replies)?$/);

  if (request.method === "GET" && url.pathname === "/api/board/threads") {
    return listThreads(env.DB, url, headers);
  }

  if (request.method === "GET" && threadMatch && !url.pathname.endsWith("/replies")) {
    return getThread(env.DB, Number(threadMatch[1]), headers);
  }

  if (request.method === "POST" && url.pathname === "/api/board/threads") {
    return createThread(request, env.DB, headers);
  }

  if (request.method === "POST" && threadMatch && url.pathname.endsWith("/replies")) {
    return createReply(request, env.DB, Number(threadMatch[1]), headers);
  }

  return json({ ok: false, error: "not found" }, 404, headers);
}
