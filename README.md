# ituyama.com

山野イツキ (Yamano Itsuki) のポートフォリオ。Next.js (App Router) 製。

## 技術スタック

- [Next.js 15](https://nextjs.org/) (App Router) / React 19 / TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- ホスティング: [Cloudflare Workers](https://developers.cloudflare.com/workers/)（静的アセット + `/api/nikkei`）

## セットアップ

```bash
npm install
npm run dev                  # http://localhost:3000
```

プロフィール内容は [`data/profile.json`](data/profile.json) が唯一の情報源です。JSON を編集するとカードが更新されます。

## デプロイ (Cloudflare Workers)

1. [Cloudflare](https://dash.cloudflare.com/) に `ituyama.com` ゾーンを追加し、レジストラのネームサーバーを Cloudflare 向けに変更する。
2. ローカルで Cloudflare にログインする。

```bash
npx wrangler login
```

3. ビルドしてデプロイする。

```bash
npm run deploy:cf
```

`wrangler.jsonc` で `ituyama.com` / `www.ituyama.com` にルートされる。`www` は apex へ 301 リダイレクトする。

### GitHub Pages から移行する場合

1. GitHub リポジトリ Settings → Pages でカスタムドメイン `ituyama.com` を解除する。
2. DNS を Cloudflare 管理に切り替える（上記）。
3. 以降の本番デプロイは `npm run deploy:cf` を使う（旧 `npm run deploy:pages` は不要）。

### 日経平均 API

本番では Worker の `/api/nikkei` が Yahoo Finance から取得する。ローカル dev では `/data/nikkei.json`（`predev` / `prebuild` で生成）にフォールバックする。
