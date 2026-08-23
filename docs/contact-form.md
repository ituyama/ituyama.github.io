# お問い合わせフォーム機能

## 概要

お問い合わせフォームは、ユーザーからの応募や問い合わせを受け付けるための機能です。フォーム送信時には、セキュリティとトラッキングの目的で、IPアドレスや端末情報などの詳細な情報を自動的に記録します。

## 使用方法

### フロントエンド

`ContactForm` コンポーネントを使用してフォームを表示します。

```tsx
import ContactForm from "@/components/ContactForm";

<ContactForm
  org="会社名"
  role="職種"
  email="contact@example.com"  // オプション
  url="https://example.com"     // オプション
/>
```

### パラメータ

- `org`: 組織名（必須）
- `role`: 募集職種名（必須）
- `email`: 送信先メールアドレス（オプション）
- `url`: 外部応募ページのURL（オプション）

## 記録される情報

### サーバー側情報

フォーム送信時に、以下のHTTPヘッダー情報が自動的に記録されます：

- **IPアドレス**: 複数のヘッダーから取得（優先順位順）
  1. `cf-connecting-ip` (Cloudflareを経由する場合)
  2. `x-forwarded-for` (プロキシ経由の場合)
  3. `x-real-ip`
- **ユーザーエージェント**: ブラウザとOS情報
- **リファラー**: 前のページのURL
- **Accept-Language**: ブラウザの言語設定
- **Accept-Encoding**: サポートされるエンコーディング
- **Connection**: 接続タイプ
- **Host**: アクセスされたホスト名
- **Origin**: リクエストのオリジン
- **すべてのHTTPヘッダー**: 完全なヘッダー情報

### クライアント側情報

JavaScriptを使用して、以下のブラウザ情報を収集します：

- **タイムゾーン**: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- **画面解像度**: `window.screen.width x window.screen.height`
- **ブラウザ言語**: `navigator.language`
- **プラットフォーム**: `navigator.platform`
- **Cookie有効状態**: `navigator.cookieEnabled`
- **User Agent Client Hints**: 対応ブラウザの場合
  - ブランド情報
  - モバイルかどうか
  - プラットフォーム

### フォームデータ

ユーザーが入力した以下の情報：

- 名前
- メールアドレス
- 会社名・所属（オプション）
- メッセージ
- 応募先の組織名と職種

## データの保存

### 保存場所

送信されたデータは `/logs` ディレクトリに保存されます。

### ファイル名形式

```
contact-{timestamp}-{random}.json
```

例: `contact-1703001234567-abc123.json`

### ファイル構造

```json
{
  "timestamp": "2024-12-19T12:34:56.789Z",
  "formData": {
    "name": "山田太郎",
    "email": "yamada@example.com",
    "company": "株式会社サンプル",
    "message": "応募します...",
    "org": "会社名",
    "role": "エンジニア",
    "targetEmail": "contact@example.com",
    "targetUrl": null
  },
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referer": "https://example.com/",
    "acceptLanguage": "ja,en-US;q=0.9,en;q=0.8",
    "acceptEncoding": "gzip, deflate, br",
    "connection": "keep-alive",
    "host": "example.com",
    "origin": "https://example.com",
    "cfRay": null,
    "cfConnectingIp": null,
    "xForwardedFor": null,
    "xRealIp": null,
    "allHeaders": {
      "accept": "*/*",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      "user-agent": "Mozilla/5.0...",
      ...
    }
  },
  "clientInfo": {
    "timezone": "Asia/Tokyo",
    "screenResolution": "1920x1080",
    "language": "ja",
    "platform": "MacIntel",
    "cookieEnabled": true,
    "userAgentData": {
      "brands": [...],
      "mobile": false,
      "platform": "macOS"
    }
  }
}
```

## セキュリティとプライバシー

### 注意事項

1. **個人情報**: ログファイルには個人を特定できる情報が含まれています
2. **Git管理**: `/logs` ディレクトリは `.gitignore` に含まれており、リポジトリにコミットされません
3. **アクセス制限**: ログファイルへのアクセスは適切に制限してください
4. **データ保持期間**: 法律や規約に従って適切なデータ保持期間を設定してください

### ユーザーへの通知

フォームには以下のテキストが表示され、ユーザーに情報収集について通知しています：

> このフォームを送信すると、IPアドレス、ブラウザ情報、端末情報などが自動的に記録されます。

## API エンドポイント

### POST /api/contact

フォーム送信を処理します。

#### リクエスト

```json
{
  "formData": {
    "name": "string",
    "email": "string",
    "company": "string",
    "message": "string",
    "org": "string",
    "role": "string",
    "targetEmail": "string | undefined",
    "targetUrl": "string | undefined"
  },
  "clientInfo": {
    "timezone": "string",
    "screenResolution": "string",
    "language": "string",
    "platform": "string",
    "cookieEnabled": "boolean"
  }
}
```

#### レスポンス

**成功時 (200 OK):**

```json
{
  "success": true,
  "message": "フォームが送信されました",
  "submissionId": "contact-1703001234567-abc123.json"
}
```

**エラー時 (500 Internal Server Error):**

```json
{
  "success": false,
  "message": "送信に失敗しました",
  "error": "エラーメッセージ"
}
```

## トラブルシューティング

### ログファイルが作成されない

1. `/logs` ディレクトリの書き込み権限を確認してください
2. サーバーのディスク容量を確認してください

### IPアドレスが取得できない

- プロキシやCDNを使用している場合、適切なヘッダーが設定されているか確認してください
- `x-forwarded-for` や `cf-connecting-ip` などのヘッダーが正しく転送されているか確認してください

### クライアント情報が不完全

- JavaScriptが無効になっているユーザーの場合、クライアント情報は収集できません
- 古いブラウザでは一部の情報（User Agent Client Hints など）が利用できない場合があります

## 今後の改善案

- データベースへの保存（現在はファイルシステム）
- メール通知機能
- 管理画面での送信履歴表示
- スパム対策（reCAPTCHA など）
- レート制限の実装
