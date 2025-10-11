# Modern Blog - Next.js + Supabase

Next.js 15とSupabaseを使用した現代的なブログシステムです。

## 主な機能

- ✅ 記事の投稿・編集・削除（CRUD）
- ✅ AI記事生成（OpenAI / Anthropic）
- ✅ CLI投稿ツール
- ✅ レスポンシブデザイン
- ✅ スラッグベースのURL

## 技術スタック

- **Next.js 15** - App Router、Server Components
- **Supabase** - PostgreSQL、Row Level Security
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - スタイリング
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

`.env.local` を編集して実際の値を設定：

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

### Web UI

- **ホーム (`/`)**: 記事一覧の表示
- **記事詳細 (`/posts/[slug]`)**: 個別記事の表示
- **管理画面 (`/admin`)**: 記事の投稿・編集・削除

### CLI投稿ツール

```bash
npm run post -- "記事タイトル" "著者名" "./cli/sample-content.md"
```

詳細は [cli/README.md](./cli/README.md) を参照してください。

### AI記事生成

管理画面の投稿フォームで「AIで本文を生成」ボタンをクリック。

## API エンドポイント

- `GET /api/posts` - 全記事取得
- `POST /api/posts` - 記事投稿
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
│   │   ├── api/          # APIルート
│   │   ├── posts/        # 記事詳細ページ
│   │   ├── admin/        # 管理画面
│   │   └── layout.tsx    # レイアウト
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ
│   └── types/            # TypeScript型定義
├── cli/                  # CLI投稿ツール
├── supabase-schema.sql   # DBスキーマ
└── .env.local           # 環境変数
```

## ライセンス

MIT
