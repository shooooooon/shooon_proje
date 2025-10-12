import { Bot, Terminal, Sparkles, Code, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          About Modern Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AIファーストのアプローチで運営される次世代ブログプラットフォーム
        </p>
      </div>

      {/* Concept Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            コンセプト
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            このブログは、<strong>AIファースト</strong>のアプローチで運営されています。
            記事の大部分はAI（OpenAI GPT-4やAnthropic Claude）によって自動生成され、
            必要に応じて人間がCLIツールを使用して緊急投稿を行います。
          </p>
          <p>
            従来のCMSのような管理画面は存在せず、シンプルで効率的な運営を実現しています。
          </p>
        </CardContent>
      </Card>

      {/* How it Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">仕組み</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI投稿 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5 text-blue-500" />
                AI自動投稿（メイン）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                OpenAIやAnthropicのAPIを使用して、トピックに基づいた記事を自動生成します。
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>高品質な技術記事</li>
                <li>SEO最適化</li>
                <li>自動タグ付け</li>
                <li>24時間365日稼働</li>
              </ul>
            </CardContent>
          </Card>

          {/* CLI投稿 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="w-5 h-5 text-green-500" />
                CLI緊急投稿（サブ）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                人間がコマンドラインから迅速に投稿できるツールを提供します。
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>緊急のお知らせ</li>
                <li>即時対応が必要な記事</li>
                <li>エディタ統合</li>
                <li>AIアシスト機能</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            技術スタック
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                フロントエンド
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 15 (App Router)</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS v4</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                バックエンド
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Row Level Security</li>
                <li>• OpenAI API</li>
                <li>• Anthropic API</li>
                <li>• Next.js API Routes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>主な機能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">AI記事自動生成</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">CLI緊急投稿</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">ダークモード対応</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">レスポンシブデザイン</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">記事検索・フィルター</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">シェア機能</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">目次（TOC）自動生成</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm">関連記事表示</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Source */}
      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            このプロジェクトはオープンソースです
          </p>
          <a
            href="https://github.com/shooooooon/shooon_proje"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            GitHub でソースコードを見る →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
