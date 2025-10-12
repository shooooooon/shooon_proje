# Modern Blog - AIファースト投稿システム

AIとCLIによる投稿に特化したブログプラットフォーム。管理画面なし、閲覧者向けUIは洗練されたデザイン。

## 🎯 コンセプト

**AIファースト + CLI緊急投稿 = 管理画面不要**

- **AI自動投稿（メイン）**: OpenAI/Anthropic APIで記事を自動生成
- **CLI緊急投稿（サブ）**: 人間がコマンドラインから迅速に投稿
- **閲覧者向けUI**: 洗練されたブログフロントエンド
- **管理画面**: なし（不要）

## 主な機能

### 投稿機能
- ✅ AI記事自動生成（OpenAI / Anthropic）
- ✅ CLI投稿ツール（緊急投稿用）
- ✅ スラッグ自動生成
- ✅ 下書き/公開ステータス（予定）

### 閲覧者向け機能
- ✅ 記事一覧・検索
- ✅ 記事詳細・TOC
- ✅ ダークモード対応
- ✅ レスポンシブデザイン
- ✅ シェア機能
- ✅ 関連記事表示

## 技術スタック

- **Next.js 15** - App Router、Server Components
- **Supabase** - PostgreSQL、Row Level Security
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **OpenAI / Anthropic** - AI記事生成

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. Settings → API から以下を取得：
   - Project URL
   - anon/public key
   - service_role key

### 3. データベースのセットアップ

Supabaseダッシュボード → SQL Editor で `supabase-schema.sql` の内容を実行

### 4. 環境変数の設定

`.env.local` を作成して実際の値を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: AI機能を使う場合
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 使用方法

### AI記事生成（メイン投稿手段）

```bash
# API経由でAI記事を生成・投稿
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Next.js 15の新機能について詳しく解説して",
    "provider": "openai"
  }'
```

### CLI投稿（緊急投稿用）

```bash
# 基本的な投稿
npm run post -- "記事タイトル" "著者名" "./content.md"

# インタラクティブモード（予定）
npm run post

# エディタで編集（予定）
npm run post -- --edit

# AI生成と組み合わせ（予定）
npm run post -- --ai "記事のトピック"
```

詳細は [cli/README.md](./cli/README.md) を参照してください。

## 閲覧者向けページ

- **ホーム (`/`)**: 記事一覧・検索
- **記事詳細 (`/posts/[slug]`)**: 個別記事・TOC・シェア
- **About (`/about`)**: プロジェクト概要

## API エンドポイント

- `GET /api/posts` - 全記事取得
- `POST /api/posts` - 記事投稿（CLI/AI用）
- `GET /api/posts/[id]` - 記事取得（ID）
- `PUT /api/posts/[id]` - 記事更新
- `DELETE /api/posts/[id]` - 記事削除
- `GET /api/posts/slug/[slug]` - 記事取得（スラッグ）
- `POST /api/generate` - AI記事生成
- `GET /api/stats` - 統計情報

## プロジェクト構造

```
shooon_proje/
├── src/
│   ├── app/
│   │   ├── api/          # API（投稿・AI生成）
│   │   ├── posts/        # 記事詳細ページ
│   │   ├── about/        # Aboutページ
│   │   └── page.tsx      # ホームページ
│   ├── components/       # UIコンポーネント
│   ├── lib/              # ユーティリティ
│   └── types/            # TypeScript型定義
├── cli/                  # CLI投稿ツール
├── supabase-schema.sql   # DBスキーマ
└── .env.local           # 環境変数
```

## デプロイ

### Vercel

```bash
# Vercel CLIでデプロイ
npm i -g vercel
vercel --prod
```

環境変数を Vercel ダッシュボードで設定してください。

## ライセンス

MIT
