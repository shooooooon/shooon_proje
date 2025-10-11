'use client';

import { useState } from 'react';
import { Loader2, Wand2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Post } from '@/types/post';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: { title: string; content: string; author: string }) => Promise<void>;
  onCancel?: () => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  content?: string;
}

export default function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'タイトルは必須です';
    } else if (title.length < 3) {
      newErrors.title = 'タイトルは3文字以上で入力してください';
    } else if (title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }

    if (!author.trim()) {
      newErrors.author = '著者名は必須です';
    } else if (author.length < 2) {
      newErrors.author = '著者名は2文字以上で入力してください';
    }

    if (!content.trim()) {
      newErrors.content = '本文は必須です';
    } else if (content.length < 10) {
      newErrors.content = '本文は10文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('タイトルを入力してください');
      return;
    }

    setIsGenerating(true);
    toast.loading('AI生成中...', { id: 'ai-generation' });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `以下のタイトルでブログ記事を書いてください: ${title}`,
          provider: 'openai',
        }),
      });

      if (!response.ok) throw new Error('AI生成に失敗しました');

      const data = await response.json();
      setContent(data.content);
      toast.success('AI生成が完了しました', { id: 'ai-generation' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI生成に失敗しました', { id: 'ai-generation' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('入力内容を確認してください');
      return;
    }

    setIsSubmitting(true);
    const toastId = post ? 'post-update' : 'post-create';
    toast.loading(post ? '更新中...' : '投稿中...', { id: toastId });

    try {
      await onSubmit({ title: title.trim(), content: content.trim(), author: author.trim() });
      toast.success(post ? '記事を更新しました' : '記事を投稿しました', { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '処理に失敗しました', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearErrors = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {post ? '記事を編集' : '新しい記事を作成'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearErrors('title');
              }}
              placeholder="記事のタイトルを入力"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Author Field */}
          <div className="space-y-2">
            <Label htmlFor="author">著者名</Label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                clearErrors('author');
              }}
              placeholder="著者名を入力"
              className={errors.author ? 'border-destructive' : ''}
            />
            {errors.author && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.author}
              </div>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">本文</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || !title.trim()}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {isGenerating ? 'AI生成中...' : 'AIで本文を生成'}
              </Button>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                clearErrors('content');
              }}
              placeholder="記事の内容を入力..."
              rows={16}
              className={`resize-none ${errors.content ? 'border-destructive' : ''}`}
            />
            {errors.content && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.content}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              文字数: {content.length} / 読了時間: 約{Math.ceil(content.length / 400)}分
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isGenerating}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? '処理中...' : (post ? '更新' : '投稿')}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
