# CLI投稿ツール

コマンドラインから記事を投稿するためのツールです。

## 使用方法

### 基本的な使い方

```bash
npm run post -- "<タイトル>" "<著者名>" "<コンテンツファイルパス>"
```

### 例

```bash
npm run post -- "My First Post" "John Doe" "./cli/sample-content.md"
```

## 事前準備

1. `.env.local` ファイルに環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. 投稿する内容をMarkdownファイルで準備します

## コンテンツファイルの形式

- Markdownファイル（.md）
- UTF-8エンコーディング
- 改行は保持されます

## 注意事項

- スラッグはタイトルから自動生成されます
- 同じスラッグの記事は重複エラーになる可能性があります
- サービスロールキーを使用するため、RLSをバイパスします
