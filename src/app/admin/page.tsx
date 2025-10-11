'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileText,
  Bot,
  Terminal,
  User,
  Calendar,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { mockPosts, mockStats } from '@/lib/mock-data';
import { Post } from '@/types/post';
import PostForm from '@/components/PostForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// UIチェック用: モックデータを使用
const USE_MOCK_DATA = true;

interface DashboardStats {
  total: number;
  ai: number;
  cli: number;
  human: number;
}

const POSTS_PER_PAGE = 6;

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // モックデータモード
      if (USE_MOCK_DATA) {
        setPosts(mockPosts);
        setIsLoading(false);
        return;
      }

      // 実際のAPI接続
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('記事の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    const total = posts.length;
    const ai = posts.filter(post =>
      post.author.toLowerCase().includes('ai') ||
      post.author.toLowerCase().includes('claude')
    ).length;
    const cli = posts.filter(post =>
      post.author.toLowerCase().includes('cli') ||
      post.author.toLowerCase().includes('command')
    ).length;
    const human = total - ai - cli;

    return { total, ai, cli, human };
  }, [posts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        authorFilter === 'all' ||
        (authorFilter === 'ai' && (post.author.toLowerCase().includes('ai') || post.author.toLowerCase().includes('claude'))) ||
        (authorFilter === 'cli' && (post.author.toLowerCase().includes('cli') || post.author.toLowerCase().includes('command'))) ||
        (authorFilter === 'human' && !(post.author.toLowerCase().includes('ai') || post.author.toLowerCase().includes('claude') || post.author.toLowerCase().includes('cli') || post.author.toLowerCase().includes('command')));

      return matchesSearch && matchesFilter;
    });
  }, [posts, searchQuery, authorFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const getAuthorInfo = (author: string) => {
    const authorLower = author.toLowerCase();
    if (authorLower.includes('ai') || authorLower.includes('claude')) {
      return { type: 'AI', icon: Bot, variant: 'secondary' as const };
    }
    if (authorLower.includes('cli') || authorLower.includes('command')) {
      return { type: 'CLI', icon: Terminal, variant: 'outline' as const };
    }
    return { type: 'Human', icon: User, variant: 'default' as const };
  };

  const handleCreate = async (data: { title: string; content: string; author: string }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('投稿に失敗しました');

      setShowForm(false);
      fetchPosts();
      toast.success('投稿が成功しました！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作に失敗しました');
    }
  };

  const handleUpdate = async (data: { title: string; content: string; author: string }) => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('更新に失敗しました');

      setEditingPost(null);
      fetchPosts();
      toast.success('更新が成功しました！');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作に失敗しました');
    }
  };

  const confirmDelete = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('削除に失敗しました');

      fetchPosts();
      toast.success('削除が成功しました！');
      setDeleteDialogOpen(false);
      setPostToDelete(null);

      // Reset to first page if current page becomes empty
      if (paginatedPosts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold">新規投稿</h1>
        </div>
        <PostForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setEditingPost(null)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold">投稿を編集</h1>
        </div>
        <PostForm
          post={editingPost}
          onSubmit={handleUpdate}
          onCancel={() => setEditingPost(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">管理画面</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          新規投稿
        </Button>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総記事数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">全ての記事</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI記事</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ai}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.ai / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLI記事</CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cli}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.cli / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">人間記事</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.human}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.human / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select value={authorFilter} onValueChange={(value) => {
          setAuthorFilter(value);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="フィルター" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全ての著者</SelectItem>
            <SelectItem value="ai">AI記事</SelectItem>
            <SelectItem value="cli">CLI記事</SelectItem>
            <SelectItem value="human">人間記事</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || authorFilter !== 'all' ? '記事が見つかりません' : 'まだ記事がありません'}
            </h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {searchQuery || authorFilter !== 'all'
                ? '検索条件やフィルターを変更してみてください。'
                : '最初の記事を投稿してブログを始めましょう。'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => {
            const authorInfo = getAuthorInfo(post.author);
            const AuthorIcon = authorInfo.icon;
            const readingTime = Math.ceil(post.content.length / 400);

            return (
              <Card key={post.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2 group-hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPost(post)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(post)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant={authorInfo.variant} className="flex items-center gap-1">
                      <AuthorIcon className="h-3 w-3" />
                      {authorInfo.type}
                    </Badge>
                    <span className="text-muted-foreground">{post.author}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.content.substring(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{readingTime}分</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                    </div>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <Eye className="h-3 w-3" />
                      <span>表示</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            前へ
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            次へ
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>記事を削除</DialogTitle>
            <DialogDescription>
              「{postToDelete?.title}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
