# ituyama.com

山野イツキ (Yamano Itsuki) のポートフォリオ。Next.js (App Router) 製。

## 技術スタック

- [Next.js 15](https://nextjs.org/) (App Router) / React 19 / TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- ホスティング: [Vercel](https://vercel.com/)

## セットアップ

```bash
npm install
npm run dev                  # http://localhost:3000
```

プロフィール内容は [`data/profile.json`](data/profile.json) が唯一の情報源です。JSON を編集するとカードが更新されます。

## デプロイ (Vercel)

1. このリポジトリを Vercel にインポート（Framework: Next.js は自動検出）。
2. デプロイ。

### 独自ドメイン `ituyama.com`

GitHub Pages から Vercel へ移すため、DNS の切り替えが必要です（**ユーザー作業**）。

1. Vercel の Project → Settings → Domains に `ituyama.com` と `www.ituyama.com` を追加。
2. ドメインレジストラの DNS を Vercel の指示どおりに変更:
   - Apex (`ituyama.com`): `A` レコードを `76.76.21.21`、もしくは案内される値に。
   - `www`: `CNAME` を `cname.vercel-dns.com`。
3. GitHub Pages 側のカスタムドメイン設定は解除（旧 `CNAME` ファイルは削除済み）。

> 反映には DNS 伝播の時間がかかる場合があります。
