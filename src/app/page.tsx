import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchPosts } from '@/lib/api';
import { mockPosts } from '@/lib/data/mock-data';
import { Post } from '@/types/post';
import PostCard from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const revalidate = 0;

// UIチェック用: モックデータを使用
const USE_MOCK_DATA = true;

async function getPosts(): Promise<Post[]> {
  // モックデータモード
  if (USE_MOCK_DATA) {
    return mockPosts;
  }

  // 実際のSupabase接続
  return await fetchPosts();
}

function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center py-16 px-8">
      <h3 className="text-xl font-semibold text-foreground mb-2">
        まだ記事がありません
      </h3>
      <p className="text-muted-foreground mb-6">
        記事が投稿されると、ここに表示されます。
      </p>
    </div>
  );
}

async function PostsList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          Modern Blog
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Next.js + Supabase で作られた現代的なブログプラットフォーム
        </p>

        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          AIファーストのアプローチで運営されるブログ。
          記事の大部分はAIによって自動生成され、必要に応じてCLIツールで緊急投稿が可能です。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/about" className="gap-2">
              このブログについて
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts" className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            最新の記事
          </h2>
          <p className="text-muted-foreground">
            最近投稿された記事をご覧ください
          </p>
        </div>

        <Suspense fallback={
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-80" />
            ))}
          </div>
        }>
          <PostsList />
        </Suspense>
      </div>
    </div>
  );
}
