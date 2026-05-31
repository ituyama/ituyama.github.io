# ituyama.com — LLM × Bento Portfolio

山野一樹 (Yamano Itsuki) のポートフォリオ。Next.js (App Router) 製で、訪問者の質問に対して OpenAI が応答を **Bento グリッドのタイル群** として組み立てて返します。

## 技術スタック

- [Next.js 15](https://nextjs.org/) (App Router) / React 19 / TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` + `@ai-sdk/openai`) + `zod` による構造化出力
- ホスティング: [Vercel](https://vercel.com/)

## セットアップ

```bash
npm install
cp .env.example .env.local   # OPENAI_API_KEY を設定
npm run dev                  # http://localhost:3000
```

### 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | OpenAI の API キー。[platform.openai.com](https://platform.openai.com/api-keys) で取得。 |
| `OPENAI_MODEL` | ー | 使用モデル。既定は `gpt-4o-mini`。 |

API キーはサーバー側 (`app/api/bento/route.ts`) でのみ使用され、クライアントには露出しません。

## 仕組み

```
ユーザー入力 → POST /api/bento → OpenAI (generateObject + Zod)
            → tiles[] (JSON) → BentoGrid が描画
```

- プロフィールの事実は [`lib/profile.ts`](lib/profile.ts) を唯一の情報源として system prompt に注入。
- タイルの形は [`lib/bentoSchema.ts`](lib/bentoSchema.ts) の Zod スキーマで定義。
- 初期表示は `initialLayout`（静的）。質問送信で LLM 生成タイルに差し替わります。

## デプロイ (Vercel)

1. このリポジトリを Vercel にインポート（Framework: Next.js は自動検出）。
2. Project Settings → Environment Variables に `OPENAI_API_KEY` を追加（必要なら `OPENAI_MODEL` も）。
3. デプロイ。

### 独自ドメイン `ituyama.com`

GitHub Pages から Vercel へ移すため、DNS の切り替えが必要です（**ユーザー作業**）。

1. Vercel の Project → Settings → Domains に `ituyama.com` と `www.ituyama.com` を追加。
2. ドメインレジストラの DNS を Vercel の指示どおりに変更:
   - Apex (`ituyama.com`): `A` レコードを `76.76.21.21`、もしくは案内される値に。
   - `www`: `CNAME` を `cname.vercel-dns.com`。
3. GitHub Pages 側のカスタムドメイン設定は解除（旧 `CNAME` ファイルは削除済み）。

> 反映には DNS 伝播の時間がかかる場合があります。
