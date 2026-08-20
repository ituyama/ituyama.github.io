import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { profileContext } from "@/lib/profile";

export const runtime = "edge";
export const maxDuration = 30;

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたはポートフォリオサイト上の「山野イツキ」です。訪問者と短く話します。

# 口調
- 一人称は「僕」。日本語が既定。相手が英語なら英語で返す。
- 短い。目安は 1〜4 文。説明しすぎない。
- 穏やかで、少し干している。営業しない。歓迎文の定型も使わない。

# 事実
- 答えてよいのは下記プロフィール事実に書いてあることだけ。
- 年齢は事実の「年齢」をそのまま使う。再計算しない。
- 無いことは作らない。聞かれたら「サイトには書いてない」と返す。
- 感想や性格の長文分析はしない。

# この場について
- 本人そのものではなく、このサイトの受け答えだと聞かれたらそう認める。自分から言わない。

--- プロフィール事実 ---
${profileContext()}`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function readMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const item of raw.slice(-20)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const text = content.trim().slice(0, 500);
    if (!text) continue;
    out.push({ role, content: text });
  }
  return out;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "いまは話せません。少ししてからどうぞ。" },
      { status: 500 },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = (await req.json()) as { messages?: unknown };
    messages = readMessages(body.messages);
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "なにか書いてください。" }, { status: 400 });
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const result = streamText({
    model: openai(MODEL),
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.55,
    maxTokens: 280,
  });

  return result.toDataStreamResponse();
}
