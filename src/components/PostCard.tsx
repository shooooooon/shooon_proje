import Link from 'next/link';
import { Clock, User, Bot, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate reading time (400 characters per minute)
  const readingTime = Math.ceil(post.content.length / 400);

  // Determine author type and icon
  const getAuthorInfo = (author: string) => {
    const authorLower = author.toLowerCase();
    if (authorLower.includes('ai') || authorLower.includes('claude')) {
      return {
        type: 'AI',
        icon: Bot,
        variant: 'secondary' as const,
        color: 'text-blue-600 dark:text-blue-400'
      };
    }
    if (authorLower.includes('cli') || authorLower.includes('command')) {
      return {
        type: 'CLI',
        icon: Terminal,
        variant: 'outline' as const,
        color: 'text-green-600 dark:text-green-400'
      };
    }
    return {
      type: 'Human',
      icon: User,
      variant: 'default' as const,
      color: 'text-purple-600 dark:text-purple-400'
    };
  };

  const authorInfo = getAuthorInfo(post.author);
  const AuthorIcon = authorInfo.icon;

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
      <CardHeader className="pb-3">
        <Link href={`/posts/${post.slug}`} className="block">
          <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant={authorInfo.variant} className="flex items-center gap-1">
              <AuthorIcon className="h-3 w-3" />
              {authorInfo.type}
            </Badge>
            <span className="text-sm text-muted-foreground">{post.author}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime}分</span>
            </div>
            <time dateTime={post.created_at}>{formattedDate}</time>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {post.content.substring(0, 200)}...
        </p>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group-hover:translate-x-1 transform duration-200"
        >
          続きを読む
          <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </CardContent>
    </Card>
  );
}
