import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { bentoLayoutSchema } from "@/lib/bentoSchema";
import { profileContext } from "@/lib/profile";

export const runtime = "edge";
export const maxDuration = 30;

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";

const SYSTEM_PROMPT = `あなたは「山野イツキ / Yamano Itsuki」のポートフォリオの Bento レイアウト構成エンジンです。
あなたの仕事は「文章を書くこと」ではなく、下記プロフィール事実を、訪問者に合わせて『どれを・どの順で・どの大きさ/色で』並べるかを決めることだけです。

# 文章を創作しない（最重要・厳守）
- タイルの title / body / caption / intro に、自分で考えた文章・歓迎文・宣伝文句・要約・感想を書いてはいけない。
- title / body / caption に入れてよいのは、下記「プロフィール事実」に実際に書かれている語句のみ。事実の値をそのまま転記する。
- 許可される加工は「項目名のラベル付け（例: title を 'Skills' '所属' 'Contact' などの短い見出しにする）」「事実の値の区切り・改行などの体裁整形」だけ。語句を言い換えたり、説明を足したりしない。
- 事実に無い情報（連絡先・URL・実績・性格・キャッチ以外の説明など）は一切作らない。
- intro は必ず空文字 "" にする（歓迎文を生成しない）。
- 年齢は事実の「年齢」の値をそのまま使う。

# タイルの作り方
- image: 画像だけの独立ブロック。顔写真は body = "/media/yamanopic.png"。愛車を見せるなら body = "/media/car.png"。事実に画像パスがあるものだけ使う。
- profile: 名前カード。body = 事実の名前（"山野イツキ / Yamano Itsuki"）。caption はキャッチ等、事実にある語句のみ。
- stat: 年齢など事実の値を大きく見せる。body は事実の値そのまま。
- map: 拠点（地名）を地図で見せる。body = 事実の拠点名（例: "神奈川県"）。拠点は stat ではなく map を使う。
- text: 所属（会社名 — 役職）など、事実の値をそのまま（必要なら改行で列挙）。
- skills: スキルを表示するならこの type を使い、body は事実のスキル名のカンマ区切り（例: "Python, TypeScript, LLM"）。
- code: その他のコード断片やターミナル風表示が必要なとき。
- link: 事実に明記された SNS/メール/URL のみ。href 必須。body はハンドルやアドレスの転記。
- activity: GitHub 草グラフ。body = 事実のグラフ画像URL。

# 配置（あなたが裁量を持つのはここだけ）
- 訪問者に合わせて、見せる事実の取捨選択と並び順を決める（採用担当=所属/スキル/連絡先を前に、エンジニア=skills/GitHub/activityを厚く、友人=名前やキャッチ中心、など）。
- タイルは 5〜9 枚。スカスカにしない。
- 各行の span 合計が 12 になるよう設計（例: 4+8, 6+6, 4+4+4, 12）。span は 3/4/6/8/12 を混ぜる。
- 高さは各タイルの内容量で自動的に決まる（rowSpan は気にしなくてよい）。情報量が少ないタイルは小さく、多いタイルは自然に大きくなる。内容に対して span を選ぶ（情報が多いものは広め）。
- accent は今は見た目に出ないので気にしなくてよい。
- icon は Bootstrap Icons 名（bi- は付けない）。例: person-badge, briefcase, mortarboard, geo-alt-fill, terminal, github, twitter-x, envelope-fill, graph-up。

--- プロフィール事実（この中の語句だけを転記して使う） ---
${profileContext()}`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY が設定されていません。.env.local を確認してください。" },
      { status: 500 },
    );
  }

  let prompt = "";
  try {
    const body = (await req.json()) as { prompt?: unknown };
    prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "質問を入力してください。" }, { status: 400 });
  }
  if (prompt.length > 500) {
    return NextResponse.json({ error: "質問が長すぎます。" }, { status: 400 });
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const { object } = await generateObject({
      model: openai(MODEL),
      schema: bentoLayoutSchema,
      system: SYSTEM_PROMPT,
      prompt: `訪問者の入力: ${prompt}\n\nこの訪問者に合わせて、プロフィール事実の中から見せる項目と並び順・大きさ・色だけを決め、5〜9枚の Bento を構成してください。タイルの文言は事実の語句をそのまま転記し、文章は一切創作しないこと。intro は "" にすること。`,
      temperature: 0.3,
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error("bento generation failed", err);
    return NextResponse.json(
      {
        error: "生成に失敗しました。表現を変えてもう一度お試しください。",
        retryable: true,
      },
      { status: 502 },
    );
  }
}
