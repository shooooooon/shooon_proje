'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  User,
  Bot,
  Terminal,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Home,
  List
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { mockPosts, getMockPostBySlug, getMockPostsByAuthor } from '@/lib/mock-data';
import { Post } from '@/types/post';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const revalidate = 0;

// UIチェック用: モックデータを使用
const USE_MOCK_DATA = true;

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

async function getPost(slug: string): Promise<Post | null> {
  // モックデータモード
  if (USE_MOCK_DATA) {
    return getMockPostBySlug(slug) || null;
  }

  // 実際のSupabase接続
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function getRelatedPosts(authorName: string, currentPostId: string): Promise<Post[]> {
  // モックデータモード
  if (USE_MOCK_DATA) {
    return getMockPostsByAuthor(authorName)
      .filter(post => post.id !== currentPostId)
      .slice(0, 3);
  }

  // 実際のSupabase接続
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author', authorName)
    .neq('id', currentPostId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data || [];
}

function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      headings.push({
        id: `heading-${index}`,
        text: trimmed.substring(3),
        level: 2
      });
    } else if (trimmed.startsWith('### ')) {
      headings.push({
        id: `heading-${index}`,
        text: trimmed.substring(4),
        level: 3
      });
    }
  });

  return headings;
}

function renderContentWithHeadings(content: string): string {
  const lines = content.split('\n');

  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      return `<h2 id="heading-${index}">${trimmed.substring(3)}</h2>`;
    } else if (trimmed.startsWith('### ')) {
      return `<h3 id="heading-${index}">${trimmed.substring(4)}</h3>`;
    }
    return line;
  }).join('\n');
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('リンクをコピーしました');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">シェア:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        className="gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="gap-2"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        {copied ? 'コピー済み' : 'リンクをコピー'}
      </Button>
    </div>
  );
}

function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  if (headings.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="w-5 h-5" />
          目次
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block text-sm hover:text-primary transition-colors ${
                    heading.level === 3 ? 'ml-4' : ''
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        ホーム
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground font-medium truncate">{title}</span>
    </nav>
  );
}

function getAuthorInfo(author: string) {
  const authorLower = author.toLowerCase();
  if (authorLower.includes('ai') || authorLower.includes('claude')) {
    return {
      type: 'AI',
      icon: Bot,
      variant: 'secondary' as const,
    };
  }
  if (authorLower.includes('cli') || authorLower.includes('command')) {
    return {
      type: 'CLI',
      icon: Terminal,
      variant: 'outline' as const,
    };
  }
  return {
    type: 'Human',
    icon: User,
    variant: 'default' as const,
  };
}

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { slug } = await params;
      const postData = await getPost(slug);

      if (!postData) {
        notFound();
        return;
      }

      setPost(postData);

      const related = await getRelatedPosts(postData.author, postData.id);
      setRelatedPosts(related);
      setLoading(false);
    }

    loadData();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil(post.content.length / 400);
  const headings = extractHeadings(post.content);
  const contentWithHeadings = renderContentWithHeadings(post.content);
  const authorInfo = getAuthorInfo(post.author);
  const AuthorIcon = authorInfo.icon;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb title={post.title} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article>
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant={authorInfo.variant} className="flex items-center gap-1">
                    <AuthorIcon className="h-3 w-3" />
                    {authorInfo.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{post.author}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime}分で読める</span>
                  </div>
                  <time dateTime={post.created_at}>{formattedDate}</time>
                </div>
              </div>

              <ShareButtons title={post.title} url={currentUrl} />
            </header>

            <Separator className="mb-8" />

            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Article Content */}
            <div
              className="prose prose-lg"
              dangerouslySetInnerHTML={{ __html: contentWithHeadings }}
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← 記事一覧に戻る
                </Link>

                <ShareButtons title={post.title} url={currentUrl} />
              </div>
            </footer>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">関連記事</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {post.author} の他の記事
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="space-y-2">
                      <Link
                        href={`/posts/${relatedPost.slug}`}
                        className="block text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {relatedPost.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(relatedPost.created_at).toLocaleDateString('ja-JP')}
                      </p>
                      {relatedPost !== relatedPosts[relatedPosts.length - 1] && (
                        <Separator />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Share Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  この記事をシェア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <ShareButtons title={post.title} url={currentUrl} />
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
