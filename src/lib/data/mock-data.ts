import { Post } from '@/types/post';

// モックデータ - フロントエンドUIチェック用
export const mockPosts: Post[] = [
  {
    id: '1',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
    title: 'Next.js 15の新機能を徹底解説',
    slug: 'nextjs-15-new-features',
    content: `# Next.js 15の新機能

Next.js 15がリリースされ、多くの新機能が追加されました。

## App Routerの改善

App Routerがさらに洗練され、パフォーマンスが向上しています。特にServer Componentsの最適化により、初期ロード時間が大幅に短縮されました。

## Turbopack統合

Turbopackがデフォルトで利用可能になり、開発時のビルド速度が劇的に向上しました。

## Server Actions

Server Actionsがstableになり、フォーム処理がより簡単になりました。

## まとめ

Next.js 15は、開発者体験とパフォーマンスの両面で大きな進化を遂げています。`.trim(),
    author: 'Human',
  },
  {
    id: '2',
    created_at: '2025-01-09T15:30:00Z',
    updated_at: '2025-01-09T15:30:00Z',
    title: 'TypeScriptでの型安全なReact開発',
    slug: 'typescript-react-type-safety',
    content: `# TypeScriptでの型安全なReact開発

TypeScriptを使用することで、Reactアプリケーションの品質を大幅に向上させることができます。

## 基本的な型定義

まずはPropsの型定義から始めましょう。

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
\`\`\`

## ジェネリクスの活用

ジェネリクスを使うことで、再利用可能なコンポーネントを作成できます。

## 型推論の活用

TypeScriptの型推論を活用することで、コードをより簡潔に保つことができます。`.trim(),
    author: 'AI',
  },
  {
    id: '3',
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-08T09:15:00Z',
    title: 'Supabaseで始めるバックエンド開発',
    slug: 'supabase-backend-development',
    content: `# Supabaseで始めるバックエンド開発

Supabaseは、Firebase代替のオープンソースバックエンドサービスです。

## 主な機能

- **PostgreSQL Database**: リレーショナルデータベース
- **Authentication**: 組み込み認証システム
- **Storage**: ファイルストレージ
- **Realtime**: リアルタイムサブスクリプション

## セットアップ

Supabaseのセットアップは非常に簡単です。

## Row Level Security (RLS)

RLSを使用することで、データベースレベルでセキュリティを実装できます。

## まとめ

Supabaseを使えば、バックエンド開発が驚くほど簡単になります。`.trim(),
    author: 'CLI',
  },
  {
    id: '4',
    created_at: '2025-01-07T14:20:00Z',
    updated_at: '2025-01-07T14:20:00Z',
    title: 'Tailwind CSSのベストプラクティス',
    slug: 'tailwind-css-best-practices',
    content: `# Tailwind CSSのベストプラクティス

Tailwind CSSを効果的に使用するためのベストプラクティスを紹介します。

## ユーティリティファーストアプローチ

Tailwind CSSはユーティリティファーストのCSSフレームワークです。

## カスタムコンポーネントの作成

繰り返し使用するパターンは、コンポーネント化しましょう。

## レスポンシブデザイン

Tailwindのブレークポイントを活用して、レスポンシブなデザインを実現します。

## ダークモード対応

dark:プレフィックスを使用して、ダークモードに対応できます。

## パフォーマンス最適化

未使用のCSSを削除して、バンドルサイズを最小化します。`.trim(),
    author: 'Human',
  },
  {
    id: '5',
    created_at: '2025-01-06T11:00:00Z',
    updated_at: '2025-01-06T11:00:00Z',
    title: 'React Server Componentsの理解',
    slug: 'react-server-components',
    content: `# React Server Componentsの理解

React Server Components (RSC) は、Reactの新しいパラダイムです。

## Server Componentsとは

Server Componentsは、サーバー側でのみレンダリングされるコンポーネントです。

## メリット

- バンドルサイズの削減
- サーバーリソースへの直接アクセス
- 自動コード分割

## Client Componentsとの違い

Client Componentsは、ブラウザでインタラクティブな機能を提供します。

## 使い分けのポイント

適切にServer ComponentsとClient Componentsを使い分けることが重要です。`.trim(),
    author: 'AI',
  },
  {
    id: '6',
    created_at: '2025-01-05T16:45:00Z',
    updated_at: '2025-01-05T16:45:00Z',
    title: 'CLIツールの開発入門',
    slug: 'cli-tool-development',
    content: `# CLIツールの開発入門

Node.jsを使用したCLIツールの開発方法を解説します。

## プロジェクトセットアップ

まずは、package.jsonでbinフィールドを設定します。

## 引数のパース

commanderやyargsを使用して、コマンドライン引数をパースします。

## インタラクティブなプロンプト

inquirerを使用して、ユーザーとのインタラクションを実装します。

## カラフルな出力

chalkを使用して、コンソール出力に色を付けます。

## エラーハンドリング

適切なエラーメッセージとexit codeを返すことが重要です。`.trim(),
    author: 'CLI',
  },
];

// 統計情報のモックデータ
export const mockStats = {
  totalPosts: 6,
  aiPosts: 2,
  cliPosts: 2,
  humanPosts: 2,
  recentPostsCount: 6,
};

// 特定のスラッグで記事を取得
export function getMockPostBySlug(slug: string): Post | undefined {
  return mockPosts.find(post => post.slug === slug);
}

// 特定のIDで記事を取得
export function getMockPostById(id: string): Post | undefined {
  return mockPosts.find(post => post.id === id);
}

// 著者でフィルター
export function getMockPostsByAuthor(author: string): Post[] {
  return mockPosts.filter(post => post.author === author);
}
