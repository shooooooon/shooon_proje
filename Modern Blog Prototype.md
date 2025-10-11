# Modern Blog Prototype

**AI・CLI・人間UIの3つの投稿方法に対応したモダンブログプロトタイプ**

Next.js 14 (App Router)、Supabase、TypeScriptを使用して構築された次世代ブログシステムです。無料枠で運用可能で、3つの異なる投稿方法を統一されたAPIで実現しています。

## 🚀 特徴

### 3つの投稿方法
- **🤖 AI自動生成**: OpenAI/Claude APIを使用した自動記事生成・投稿
- **⌨️ CLI投稿**: コマンドラインからの効率的な記事投稿
- **👤 Web管理画面**: 直感的なWebインターフェースでの記事管理

### 技術的特徴
- **モダンスタック**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (Database + Auth + Storage)
- **SEO最適化**: 静的サイト生成 (ISR) + メタデータ最適化
- **無料枠対応**: Supabase + Cloudflare Pages/Vercel Free Planで運用可能
- **API ファースト**: REST API設計でLLMエージェントやn8n等と容易に連携

## 📋 目次

- [クイックスタート](#クイックスタート)
- [セットアップ](#セットアップ)
- [使用方法](#使用方法)
- [API ドキュメント](#api-ドキュメント)
- [デプロイ](#デプロイ)
- [開発](#開発)
- [トラブルシューティング](#トラブルシューティング)

## ⚡ クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd modern-blog-prototype
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集して必要な環境変数を設定：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# AI API Keys (オプション)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. データベースのセットアップ

Supabaseプロジェクトで `supabase-schema.sql` を実行：

```sql
-- supabase-schema.sql の内容をSupabase SQL Editorで実行
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 🛠 セットアップ

### Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) でアカウントを作成
2. 新しいプロジェクトを作成
3. SQL Editorで `supabase-schema.sql` を実行
4. Settings > API から必要なキーを取得

### AI APIの設定（オプション）

AI記事生成機能を使用する場合：

- **OpenAI**: [OpenAI Platform](https://platform.openai.com) でAPIキーを取得
- **Anthropic**: [Anthropic Console](https://console.anthropic.com) でAPIキーを取得

## 📝 使用方法

### 1. Web管理画面での投稿

1. http://localhost:3000/admin にアクセス
2. 「新しい記事を作成」をクリック
3. タイトル、本文を入力して投稿

### 2. AI自動生成での投稿

#### Web画面から
1. 管理画面のAI記事生成セクションでプロンプトを入力
2. 「生成・投稿」をクリック

#### API経由
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Next.jsの最新機能について記事を書いて"}'
```

### 3. CLI投稿

#### 基本的な使用方法
```bash
# 直接投稿
npx tsx cli/post.ts "記事タイトル" "記事の本文"

# npm scriptを使用
npm run post "記事タイトル" "記事の本文"
```

#### ファイルから投稿
```bash
npx tsx cli/post.ts --title "記事タイトル" --file ./content.md
```

#### 詳細な使用方法
[CLI README](./cli/README.md) を参照してください。

## 📚 API ドキュメント

### エンドポイント一覧

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/posts` | GET | 記事一覧取得 |
| `/api/posts` | POST | 記事作成 |
| `/api/posts/[id]` | GET | 記事詳細取得 |
| `/api/posts/[id]` | PUT | 記事更新 |
| `/api/posts/[id]` | DELETE | 記事削除 |
| `/api/posts/slug/[slug]` | GET | スラッグで記事取得 |
| `/api/generate` | POST | AI記事生成・投稿 |
| `/api/stats` | GET | ブログ統計取得 |

### 記事作成API

```bash
POST /api/posts
Content-Type: application/json

{
  "title": "記事タイトル",
  "content": "記事本文（Markdown対応）",
  "author": "Human|AI|CLI",
  "slug": "custom-slug" // オプション
}
```

### AI記事生成API

```bash
POST /api/generate
Content-Type: application/json

{
  "prompt": "記事生成のプロンプト",
  "title": "記事タイトル" // オプション
}
```

### クエリパラメータ（記事一覧）

- `author`: 投稿者でフィルタ (`AI`, `CLI`, `Human`)
- `search`: タイトル・本文で検索
- `sortBy`: ソート基準 (`created_at`, `updated_at`, `title`)
- `sortOrder`: ソート順 (`asc`, `desc`)
- `limit`: 取得件数 (デフォルト: 10)
- `offset`: オフセット (デフォルト: 0)

## 🚀 デプロイ

### Vercel

1. Vercelアカウントでプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

```bash
# Vercel CLIを使用
npm i -g vercel
vercel --prod
```

### Cloudflare Pages

1. GitHubリポジトリを接続
2. ビルド設定:
   - Build command: `npm run build`
   - Build output directory: `.next`
3. 環境変数を設定

### Docker

```bash
# イメージをビルド
docker build -t modern-blog-prototype .

# コンテナを起動
docker run -p 3000:3000 --env-file .env.local modern-blog-prototype
```

### Docker Compose

```bash
# 環境変数を設定
cp .env.example .env

# サービスを起動
docker-compose up -d
```

## 🔧 開発

### プロジェクト構造

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── posts/[slug]/   # 記事詳細ページ
│   │   ├── admin/          # 管理画面
│   │   └── ...
│   ├── components/         # Reactコンポーネント
│   ├── lib/               # ユーティリティ
│   └── types/             # TypeScript型定義
├── cli/                   # CLI投稿ツール
├── .github/workflows/     # GitHub Actions
└── ...
```

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint

# CLI投稿
npm run post "タイトル" "本文"
```

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー | ✅ |
| `NEXT_PUBLIC_BASE_URL` | アプリケーション URL | ❌ |
| `OPENAI_API_KEY` | OpenAI API キー | ❌ |
| `ANTHROPIC_API_KEY` | Anthropic API キー | ❌ |

## 🐛 トラブルシューティング

### よくある問題

#### 1. Supabase接続エラー
```
Error: Invalid API key
```

**解決方法**: 環境変数が正しく設定されているか確認

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 2. ビルドエラー
```
Type error: Cannot find module '@/lib/supabase'
```

**解決方法**: TypeScriptの設定を確認

```bash
npx tsc --noEmit
```

#### 3. AI生成が動作しない
```
No AI service available
```

**解決方法**: AI APIキーが設定されているか確認

```bash
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY
```

### デバッグ方法

1. **ログの確認**
   ```bash
   # 開発サーバーのログを確認
   npm run dev
   ```

2. **データベースの確認**
   ```sql
   -- Supabase SQL Editorで実行
   SELECT * FROM posts ORDER BY created_at DESC LIMIT 5;
   ```

3. **API テスト**
   ```bash
   # 記事一覧API
   curl http://localhost:3000/api/posts
   
   # 記事作成API
   curl -X POST http://localhost:3000/api/posts \
     -H "Content-Type: application/json" \
     -d '{"title":"テスト","content":"テスト本文","author":"Human"}'
   ```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Supabase](https://supabase.com/) - バックエンドサービス
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [OpenAI](https://openai.com/) - AI API
- [Anthropic](https://anthropic.com/) - AI API

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/your-repo/issues) で報告してください。

---

**Built with ❤️ by Manus AI**
