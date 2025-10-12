# プロジェクトリファクタリング: AIファースト + CLI投稿モデル

## 目的

管理画面（GUI）を削除し、AIとCLIによる投稿に特化したブログシステムにリファクタリングする。
閲覧者向けのフロントエンド（ブログUI）は洗練されたまま維持する。

## コンセプト

```
投稿者サイド:
  ┌─────────────┐
  │     AI      │ ← メイン投稿手段（自動生成）
  │  (自動生成)  │
  └──────┬──────┘
         │ API
         ↓
  ┌─────────────┐
  │  Supabase   │ ← データベース
  │  Database   │
  └──────┬──────┘
         ↑
         │ CLI
  ┌──────┴──────┐
  │     CLI     │ ← 緊急投稿手段（人間）
  │  (緊急投稿)  │
  └─────────────┘

閲覧者サイド:
  ┌─────────────┐
  │   Next.js   │ ← 洗練されたブログUI
  │  Frontend   │    （記事一覧・詳細・検索）
  └─────────────┘
```

## 削除対象

### 1. 管理画面ページ
- `src/app/admin/page.tsx` - 削除
- `src/app/admin/` ディレクトリ全体 - 削除

### 2. 管理画面専用コンポーネント
- `src/components/PostForm.tsx` - 削除（CLI側で実装）

### 3. 管理画面へのリンク
- `src/components/Header.tsx` - 管理画面リンクを削除
- `src/app/page.tsx` - 管理画面へのボタンを削除

## 維持・強化対象

### ✅ フロントエンド（閲覧者向け）

#### 1. ホームページ (`src/app/page.tsx`)
- 記事一覧表示
- 検索・フィルター機能
- ダークモード
- レスポンシブデザイン

#### 2. 記事詳細ページ (`src/app/posts/[slug]/page.tsx`)
- 記事本文表示（prose スタイル）
- 目次（TOC）
- シェアボタン
- 関連記事表示

#### 3. UIコンポーネント
- `src/components/Header.tsx` - ナビゲーション（管理画面リンクを削除）
- `src/components/Footer.tsx` - フッター
- `src/components/PostCard.tsx` - 記事カード
- `src/components/theme-provider.tsx` - ダークモード
- `src/components/theme-toggle.tsx` - テーマ切り替え
- `src/components/ui/*` - shadcn/uiコンポーネント

### ✅ API（バックエンド）

#### 1. 記事API
- `src/app/api/posts/route.ts` - 記事一覧・作成
- `src/app/api/posts/[id]/route.ts` - 記事取得・更新・削除
- `src/app/api/posts/slug/[slug]/route.ts` - スラッグで記事取得

#### 2. AI生成API
- `src/app/api/generate/route.ts` - AI記事生成（維持・強化）

#### 3. 統計API
- `src/app/api/stats/route.ts` - ブログ統計（オプション）

### ✅ CLI投稿ツール（強化対象）

#### 現在のファイル
- `cli/post.ts` - 基本的な投稿機能
- `cli/README.md` - ドキュメント
- `cli/sample-content.md` - サンプル

#### 強化内容（CLI_ENHANCEMENT_PROMPT.mdに基づく）
1. インタラクティブモード（inquirer）
2. エディタ統合（vim, VS Code等）
3. 下書き/公開ステータス
4. AIアシスト機能
5. Frontmatterサポート
6. 既存記事の編集機能

## 実装タスク

### タスク1: 管理画面の削除

```bash
# 削除対象
rm -rf src/app/admin
rm src/components/PostForm.tsx
```

**変更ファイル**:
- `src/components/Header.tsx` - 管理画面リンクを削除
- `src/app/page.tsx` - 管理画面へのボタンを削除

**Header.tsx の変更**:
```tsx
// 削除: 管理画面リンク
// <Link href="/admin" className="text-gray-600 hover:text-gray-900">
//   管理画面
// </Link>

// 維持: ホームリンクとテーマ切り替えのみ
<Link href="/" className="text-2xl font-bold text-gray-900">
  Modern Blog
</Link>
<ThemeToggle />
```

**page.tsx の変更**:
```tsx
// 削除: 管理画面へのボタン
// <Button asChild size="lg">
//   <Link href="/admin" className="gap-2">
//     管理画面へ
//     <ArrowRight className="w-4 h-4" />
//   </Link>
// </Button>

// 維持: 記事一覧のみ
```

### タスク2: Header の簡潔化

**新しいHeader構成**:
```tsx
<header>
  <nav>
    {/* ロゴ */}
    <Link href="/">Modern Blog</Link>
    
    {/* ナビゲーション */}
    <div>
      <Link href="/">ホーム</Link>
      <Link href="/about">About</Link>
      <ThemeToggle />
    </div>
  </nav>
</header>
```

### タスク3: Aboutページの追加（オプション）

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto">
      <h1>About This Blog</h1>
      <p>
        このブログは、AIファーストのアプローチで運営されています。
        記事の大部分はAIによって自動生成され、必要に応じて人間が
        CLIツールを使用して緊急投稿を行います。
      </p>
      <h2>技術スタック</h2>
      <ul>
        <li>Next.js 15</li>
        <li>Supabase</li>
        <li>OpenAI / Anthropic</li>
        <li>shadcn/ui</li>
      </ul>
    </div>
  );
}
```

### タスク4: README の更新

**更新内容**:
```markdown
# Modern Blog - AIファースト投稿システム

AIとCLIによる投稿に特化したブログプラットフォーム。
管理画面なし、閲覧者向けUIは洗練されたデザイン。

## 投稿方法

### 1. AI自動生成（メイン）
### 2. CLI投稿（緊急時）

## 閲覧者向け機能

- 記事一覧・検索
- 記事詳細・TOC
- ダークモード
- レスポンシブ
```

### タスク5: package.json の scripts 更新

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "next lint",
    "post": "tsx cli/post.ts",
    "post:edit": "tsx cli/post.ts --edit",
    "post:ai": "tsx cli/post.ts --ai",
    "post:list": "tsx cli/post.ts --list"
  }
}
```

## 検証項目

リファクタリング完了後、以下を確認：

### フロントエンド（閲覧者向け）
- [ ] ホームページが正常に表示される
- [ ] 記事一覧が表示される
- [ ] 記事詳細ページが動作する
- [ ] ダークモードが動作する
- [ ] レスポンシブデザインが維持されている
- [ ] 管理画面へのリンクが存在しない

### API
- [ ] GET /api/posts が動作する
- [ ] GET /api/posts/[id] が動作する
- [ ] POST /api/posts が動作する（CLI用）
- [ ] POST /api/generate が動作する（AI用）

### CLI
- [ ] npm run post が動作する
- [ ] AI生成APIと連携できる

### ビルド
- [ ] npm run build が成功する
- [ ] エラー・警告がない

## 最終的なディレクトリ構造

```
shooon_proje/
├── src/
│   ├── app/
│   │   ├── api/              # API（維持）
│   │   │   ├── posts/
│   │   │   ├── generate/
│   │   │   └── stats/
│   │   ├── posts/[slug]/     # 記事詳細（維持）
│   │   ├── about/            # Aboutページ（新規）
│   │   ├── layout.tsx        # レイアウト（維持）
│   │   └── page.tsx          # ホーム（維持）
│   ├── components/           # UIコンポーネント（維持）
│   │   ├── Header.tsx        # 修正（管理画面リンク削除）
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   └── ui/               # shadcn/ui
│   ├── lib/                  # ユーティリティ（維持）
│   └── types/                # 型定義（維持）
├── cli/                      # CLI（強化対象）
│   ├── post.ts
│   └── README.md
└── README.md                 # 更新
```

## 実装順序

1. **管理画面の削除** - ファイル削除とリンク削除
2. **Header の簡潔化** - 管理画面リンクを削除
3. **Aboutページ追加** - 簡単な説明ページ
4. **README 更新** - 新しいコンセプトを反映
5. **ビルド確認** - エラーがないことを確認
6. **動作確認** - フロントエンドが正常に動作

---

## Claude CLI への指示

以下の順番で実装してください：

1. `src/app/admin/` ディレクトリを削除
2. `src/components/PostForm.tsx` を削除
3. `src/components/Header.tsx` から管理画面リンクを削除
4. `src/app/page.tsx` から管理画面へのボタンを削除
5. `src/app/about/page.tsx` を作成
6. `README.md` を更新
7. `npm run build` でビルド確認
8. 変更をコミット

各ステップ完了後、動作確認を行ってください。
