# プロジェクト構造の拡張性向上プロンプト

## 目的

AIファースト+CLI投稿のコンセプトを**維持**しつつ、将来の機能追加や方向転換に備えた構造にリファクタリングする。

## 原則

1. **現在は無効化、将来は有効化可能**
   - `_` プレフィックスでNext.jsのルーティングから除外
   - コードは残すが実行されない
   - 必要時にリネームするだけで有効化

2. **ドキュメント駆動**
   - 各無効化機能にREADME.mdを配置
   - 有効化手順を明記
   - なぜ無効化しているかの説明

3. **段階的実装**
   - フェーズ1: 構造整理と無効化機能の配置
   - フェーズ2: 閲覧者UX向上（記事一覧、検索）
   - フェーズ3: 必要時に拡張機能を有効化

## フェーズ1: 構造整理と拡張性確保

### タスク1-1: components/ の整理

**現在:**
```
components/
├── Header.tsx
├── Footer.tsx
├── PostCard.tsx
├── theme-provider.tsx
├── theme-toggle.tsx
└── ui/
```

**変更後:**
```
components/
├── layout/
│   ├── Header.tsx           # 移動
│   ├── Footer.tsx           # 移動
│   └── _Sidebar.tsx         # 🔒 新規作成（無効化）
├── posts/
│   ├── PostCard.tsx         # 移動
│   ├── PostList.tsx         # ✅ 新規作成
│   └── PostPagination.tsx   # ✅ 新規作成
├── search/
│   └── SearchBox.tsx        # ✅ 新規作成
├── theme-provider.tsx
├── theme-toggle.tsx
└── ui/                      # そのまま
```

**実装:**

1. ディレクトリ作成と移動
```bash
mkdir -p src/components/{layout,posts,search}
mv src/components/Header.tsx src/components/layout/
mv src/components/Footer.tsx src/components/layout/
mv src/components/PostCard.tsx src/components/posts/
```

2. import パスの更新
```typescript
// 全ファイルで以下を置換
import Header from '@/components/Header'
↓
import Header from '@/components/layout/Header'
```

3. 無効化されたSidebarコンポーネント作成
```typescript
// src/components/layout/_Sidebar.tsx
/**
 * サイドバーコンポーネント（無効化中）
 * 
 * 有効化方法:
 * 1. このファイルを _Sidebar.tsx → Sidebar.tsx にリネーム
 * 2. layout.tsx でインポートして使用
 * 
 * 無効化理由:
 * - モバイルファーストデザインのため現在は不要
 * - AIファーストのシンプルなUIを維持
 */

export default function Sidebar() {
  return (
    <aside className="w-64 bg-muted p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">カテゴリ</h3>
          {/* カテゴリリスト */}
        </div>
        <div>
          <h3 className="font-semibold mb-2">タグ</h3>
          {/* タグクラウド */}
        </div>
      </div>
    </aside>
  );
}
```

4. PostList コンポーネント作成
```typescript
// src/components/posts/PostList.tsx
import { Post } from '@/types/post';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">記事がありません</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

5. PostPagination コンポーネント作成
```typescript
// src/components/posts/PostPagination.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PostPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PostPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        前へ
      </Button>
      
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        次へ
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
```

6. SearchBox コンポーネント作成
```typescript
// src/components/search/SearchBox.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="search"
        placeholder="記事を検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}
```

### タスク1-2: lib/ の整理

**現在:**
```
lib/
├── mock-data.ts
├── supabase.ts
└── utils.ts
```

**変更後:**
```
lib/
├── api/
│   ├── index.ts             # 統合版（現在使用）
│   └── _modular/            # 🔒 分割版（将来用）
│       ├── README.md
│       ├── posts.ts
│       ├── tags.ts
│       └── categories.ts
├── client/
│   └── supabase.ts          # 移動
├── data/
│   └── mock-data.ts         # 移動
└── utils/
    └── index.ts             # utils.ts をリネーム
```

**実装:**

1. ディレクトリ作成と移動
```bash
mkdir -p src/lib/{api,client,data,utils,api/_modular}
mv src/lib/supabase.ts src/lib/client/
mv src/lib/mock-data.ts src/lib/data/
mv src/lib/utils.ts src/lib/utils/index.ts
```

2. lib/api/index.ts 作成（統合版）
```typescript
// src/lib/api/index.ts
import { supabase } from '@/lib/client/supabase';
import { Post } from '@/types/post';

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

3. lib/api/_modular/README.md 作成
```markdown
# モジュラーAPI（無効化中）

現在は `lib/api/index.ts` で統合版を使用しています。

## 有効化方法

1. `_modular/` を `modular/` にリネーム
2. `lib/api/index.ts` でモジュールをインポート:
   ```typescript
   export * from './modular/posts';
   export * from './modular/tags';
   export * from './modular/categories';
   ```

## 無効化理由

- 小規模プロジェクトでは統合版で十分
- ファイル数を減らしてメンテナンス性向上
- 必要に応じて分割可能な設計を維持
```

4. 無効化されたモジュラー版作成
```typescript
// src/lib/api/_modular/posts.ts
import { supabase } from '@/lib/client/supabase';
import { Post } from '@/types/post';

export async function fetchPosts(): Promise<Post[]> {
  // 実装...
}

export async function fetchPostById(id: string): Promise<Post | null> {
  // 実装...
}
```

### タスク1-3: 無効化された管理画面の配置

**構造:**
```
src/app/_admin/
├── README.md                # 有効化方法を記載
├── layout.tsx               # 管理画面専用レイアウト
├── page.tsx                 # ダッシュボード
└── posts/
    ├── page.tsx             # 記事一覧
    ├── new/
    │   └── page.tsx         # 新規作成
    └── [slug]/
        └── page.tsx         # 編集
```

**実装:**

1. ディレクトリとREADME作成
```bash
mkdir -p src/app/_admin/posts/{new,[slug]}
```

2. README.md
```markdown
# 管理画面（無効化中）

現在このプロジェクトはAIファースト+CLI投稿モデルです。

## 有効化方法

1. `_admin/` を `admin/` にリネーム:
   ```bash
   mv src/app/_admin src/app/admin
   ```

2. Header.tsx で管理画面リンクを追加:
   ```tsx
   <Link href="/admin">管理画面</Link>
   ```

3. 開発サーバーを再起動:
   ```bash
   npm run dev
   ```

## 無効化理由

- **AIファーストのコンセプト**: AI自動生成がメイン投稿手段
- **CLI投稿**: 人間の緊急投稿はCLIツールで対応
- **シンプルさ**: 管理画面なしでメンテナンスコストを削減

## 機能一覧

この管理画面には以下の機能が実装されています:

- ダッシュボード（統計情報）
- 記事一覧・検索
- 記事の新規作成
- 記事の編集・削除
- AIアシスト投稿
- プレビュー機能

## 代替手段（現在推奨）

管理画面の代わりに以下を使用してください:

### CLI投稿
```bash
npm run post -- "タイトル" "著者" "./content.md"
```

### AI自動生成
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "記事のトピック", "provider": "openai"}'
```
```

3. 管理画面ページの実装（簡易版）
```typescript
// src/app/_admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1>管理画面（無効化中）</h1>
      <p>詳細は README.md を参照してください。</p>
    </div>
  );
}
```

### タスク1-4: 将来の型定義

```
types/
├── post.ts              # 既存
└── _future/             # 🔒 将来用
    ├── README.md
    ├── tag.ts
    ├── category.ts
    └── comment.ts
```

**実装:**

```typescript
// src/types/_future/tag.ts
export interface Tag {
  id: string;
  name: string;
  slug: string;
  post_count?: number;
}

// src/types/_future/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
}

// src/types/_future/comment.ts
export interface Comment {
  id: string;
  post_id: string;
  author: string;
  content: string;
  created_at: string;
}
```

## フェーズ2: 閲覧者UX向上（実装推奨）

### タスク2-1: 全記事一覧ページ

```typescript
// src/app/posts/page.tsx
import { fetchPosts } from '@/lib/api';
import PostList from '@/components/posts/PostList';
import PostPagination from '@/components/posts/PostPagination';

export default async function PostsPage() {
  const posts = await fetchPosts();
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">全記事</h1>
        <p className="text-muted-foreground">
          {posts.length}件の記事があります
        </p>
      </div>
      
      <PostList posts={posts} />
      
      {/* ページネーションは将来実装 */}
    </div>
  );
}
```

### タスク2-2: 検索ページ

```typescript
// src/app/search/page.tsx
import { searchPosts } from '@/lib/api';
import PostList from '@/components/posts/PostList';
import SearchBox from '@/components/search/SearchBox';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = q ? await searchPosts(q) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">検索</h1>
        <SearchBox />
      </div>

      {q && (
        <div>
          <p className="text-muted-foreground mb-4">
            「{q}」の検索結果: {posts.length}件
          </p>
          <PostList posts={posts} />
        </div>
      )}
    </div>
  );
}
```

### タスク2-3: Headerに検索ボタン追加

```typescript
// src/components/layout/Header.tsx に追加
<Button variant="ghost" size="sm" asChild>
  <Link href="/search">
    <Search className="w-4 h-4" />
  </Link>
</Button>
```

## フェーズ3: 無効化されたルート

### タスク3-1: タグ・カテゴリルート（無効化）

```
src/app/posts/_archived/
├── README.md
├── tag/
│   └── [tag]/
│       └── page.tsx
└── category/
    └── [category]/
        └── page.tsx
```

**README.md:**
```markdown
# タグ・カテゴリ機能（無効化中）

## 有効化方法

1. データベーススキーマを拡張
2. `_archived/` を削除して直接 `posts/` 配下に配置
3. 型定義を `types/_future/` から移動

## 必要な準備

- Supabase: tags, categories テーブル作成
- 多対多リレーション設定
- API実装
```

## 最終的なディレクトリ構造

```
shooon_proje/
├── cli/
│   └── post.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # ホーム
│   │   ├── posts/
│   │   │   ├── page.tsx            # ✅ 全記事一覧
│   │   │   ├── [slug]/page.tsx    # 記事詳細
│   │   │   └── _archived/          # 🔒 将来用
│   │   ├── search/
│   │   │   └── page.tsx            # ✅ 検索
│   │   ├── about/page.tsx
│   │   ├── _admin/                 # 🔒 管理画面（無効）
│   │   │   ├── README.md
│   │   │   └── ...
│   │   └── api/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── _Sidebar.tsx        # 🔒 無効
│   │   ├── posts/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx        # ✅ 新規
│   │   │   └── PostPagination.tsx  # ✅ 新規
│   │   ├── search/
│   │   │   └── SearchBox.tsx       # ✅ 新規
│   │   └── ui/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── index.ts            # 統合版
│   │   │   └── _modular/           # 🔒 分割版
│   │   ├── client/
│   │   ├── data/
│   │   └── utils/
│   └── types/
│       ├── post.ts
│       └── _future/                # 🔒 将来用
└── ...
```

## 実装順序

1. **フェーズ1のタスク1-1**: components整理（1時間）
2. **フェーズ1のタスク1-2**: lib整理（30分）
3. **フェーズ2**: 記事一覧・検索実装（2時間）
4. **フェーズ1のタスク1-3, 1-4**: 無効化機能配置（1時間）

合計: 約4-5時間

## 検証項目

- [ ] 既存機能が正常に動作
- [ ] `_` で始まるディレクトリがルーティングされない
- [ ] 記事一覧・検索が動作
- [ ] README.mdで有効化方法が明確
- [ ] ビルドエラーなし

---

このプロンプトをClaude CLIに渡して、段階的に実装してください。
