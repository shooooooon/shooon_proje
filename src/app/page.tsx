import { Suspense } from 'react';
import { PenTool, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { mockPosts } from '@/lib/mock-data';
import { Post } from '@/types/post';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

function EmptyState() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
            <PenTool className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          まだ記事がありません
        </h3>

        <p className="text-muted-foreground mb-6 max-w-sm">
          最初の記事を投稿して、あなたのブログを始めましょう。
          管理画面から簡単に記事を作成できます。
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/admin" className="gap-2">
              <PenTool className="w-4 h-4" />
              記事を投稿する
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/admin" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI記事生成を試す
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
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
          AI記事生成機能、CLI投稿ツール、ダークモード対応など、
          最新の技術スタックを活用したブログシステムです。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/admin" className="gap-2">
              管理画面へ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="#posts" className="gap-2">
              記事を読む
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
              <div key={i} className="animate-pulse">
                <Card className="h-80" />
              </div>
            ))}
          </div>
        }>
          <PostsList />
        </Suspense>
      </div>
    </div>
  );
}
