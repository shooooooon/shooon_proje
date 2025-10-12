# CLI投稿ツール強化プロンプト（Claude CLI用）

## プロジェクトコンセプト

**AIファースト + 人間の緊急投稿対応**

- メイン: AIが記事を自動生成・投稿
- サブ: 人間がCLIで迅速に投稿（緊急時・即時対応用）
- 管理画面: 補助的な編集・確認用

## 現状の課題

現在のCLI投稿ツール (`cli/post.ts`) は基本的な機能のみ：
- タイトル、著者、コンテンツファイルパスを指定して投稿
- スラッグ自動生成
- エラーハンドリングが最小限

## 強化すべき機能

### 最優先（緊急投稿に必須）

#### 1. インタラクティブモード

```bash
# コマンド実行で対話的に入力
npm run post

# 以下のような対話形式
? タイトルを入力してください: 
? 著者名（デフォルト: CLI）: 
? コンテンツファイルのパス、またはエディタで直接入力 (e): 
? タグを追加しますか？ (カンマ区切り): 
? すぐに公開しますか？ [Y/n]: 
```

**使用ライブラリ**: `inquirer` または `prompts`

#### 2. エディタ統合

```bash
# デフォルトエディタで記事を書く
npm run post -- --edit

# 特定エディタを指定
npm run post -- --editor vim
npm run post -- --editor code  # VS Code
```

**使用ライブラリ**: `editor` または `@inquirer/editor`

#### 3. テンプレート機能

```bash
# テンプレートから新規作成
npm run post -- --template blog

# カスタムテンプレート
npm run post -- --template ./templates/announcement.md
```

**テンプレート例**:
```markdown
# タイトル

## 概要
[ここに概要を書く]

## 本文
[ここに本文を書く]

## まとめ
[ここにまとめを書く]

---
著者: CLI
タグ: 
```

#### 4. Markdown → リッチテキスト自動変換

- Markdownを解析
- コードブロックのシンタックスハイライト
- 画像の自動最適化

#### 5. 下書き/公開ステータス

```bash
# 下書きとして保存
npm run post -- --draft

# すぐに公開（デフォルト）
npm run post -- --publish
```

### 高優先（利便性向上）

#### 6. AIアシスト機能

```bash
# タイトルからAIで本文生成
npm run post -- --ai-generate "Next.jsの新機能について"

# 既存の下書きをAIで改善
npm run post -- --ai-improve draft-id-123

# SEO最適化提案
npm run post -- --ai-seo ./article.md
```

#### 7. 一括投稿

```bash
# フォルダ内の全Markdownファイルを投稿
npm run post -- --batch ./articles/

# CSVから一括投稿
npm run post -- --csv articles.csv
```

#### 8. 既存記事の編集

```bash
# IDで記事を取得して編集
npm run post -- --edit-id abc-123

# スラッグで記事を取得して編集
npm run post -- --edit-slug nextjs-15-features
```

#### 9. プレビュー機能

```bash
# 投稿前にブラウザでプレビュー
npm run post -- --preview ./article.md

# マークダウンをターミナルで表示
npm run post -- --preview-cli ./article.md
```

#### 10. メタデータ管理

```yaml
---
title: "記事タイトル"
author: "CLI"
tags: ["nextjs", "typescript"]
category: "技術"
status: "published"  # or "draft"
publishedAt: "2025-01-10T12:00:00Z"
description: "記事の説明"
---

# 本文開始
```

### 中優先（拡張機能）

#### 11. 画像アップロード

```bash
# 記事内の画像を自動アップロード
npm run post -- --upload-images ./article.md

# 特定の画像をアップロードして挿入
npm run post -- --image ./hero.jpg
```

#### 12. スケジュール投稿

```bash
# 指定日時に公開
npm run post -- --schedule "2025-01-15 10:00"
```

#### 13. 投稿履歴・ログ

```bash
# 最近の投稿を表示
npm run post -- --list

# 特定の記事を検索
npm run post -- --search "Next.js"

# 投稿統計
npm run post -- --stats
```

#### 14. バリデーション

```bash
# 投稿前にチェック
npm run post -- --validate ./article.md

# チェック項目:
# - タイトルの長さ（50文字以内推奨）
# - 本文の長さ（最低300文字）
# - リンク切れチェック
# - 画像の存在確認
```

## 実装の優先順位

### フェーズ1: 緊急投稿の快適化
1. インタラクティブモード（inquirer）
2. エディタ統合
3. 下書き/公開ステータス

### フェーズ2: AI統合
4. AIアシスト機能（タイトルから生成）
5. AI改善機能

### フェーズ3: 高度な機能
6. 既存記事の編集
7. メタデータ管理（Frontmatter）
8. プレビュー機能

### フェーズ4: 拡張機能
9. 画像アップロード
10. 一括投稿
11. スケジュール投稿

## 技術スタック

### 推奨ライブラリ

```json
{
  "dependencies": {
    "inquirer": "^9.2.0",           // 対話型CLI
    "commander": "^11.0.0",         // コマンドライン引数パース
    "chalk": "^5.3.0",              // カラフル出力
    "ora": "^7.0.0",                // スピナー/ローディング
    "gray-matter": "^4.0.3",        // Frontmatter解析
    "marked": "^11.0.0",            // Markdown解析
    "open": "^10.0.0",              // ブラウザでプレビュー
    "execa": "^8.0.0",              // エディタ起動
    "date-fns": "^3.0.0",           // 日時処理
    "zod": "^3.22.0"                // バリデーション
  }
}
```

## 使用例（完成形）

### シンプルな投稿
```bash
npm run post
# 対話形式で入力
```

### 緊急投稿（エディタ起動）
```bash
npm run post -- --edit
# デフォルトエディタが開く → 書く → 保存 → 自動投稿
```

### AI生成投稿
```bash
npm run post -- --ai "Next.js 15の新機能について詳しく解説"
# AIが記事を生成 → 確認 → 投稿
```

### ファイルから投稿（現在も可能）
```bash
npm run post -- --file ./article.md
# メタデータも読み取って投稿
```

### 既存記事を編集
```bash
npm run post -- --edit-slug nextjs-15-features
# 記事を取得 → エディタで編集 → 更新
```

## 実装指示（Claude CLIへ）

以下の順番で実装してください：

1. **commander導入**: コマンドライン引数の構造化
2. **inquirer導入**: インタラクティブモードの実装
3. **エディタ統合**: デフォルトエディタでの編集機能
4. **gray-matter導入**: Frontmatterサポート
5. **下書き/公開**: ステータス管理機能
6. **chalk/ora導入**: UI/UX改善
7. **エラーハンドリング強化**: わかりやすいエラーメッセージ

## 成果物

- `cli/post.ts` - 機能強化版
- `cli/commands/` - コマンド別ファイル
  - `create.ts` - 新規作成
  - `edit.ts` - 編集
  - `list.ts` - 一覧表示
  - `ai.ts` - AI機能
- `cli/templates/` - テンプレートファイル
- `cli/README.md` - 更新されたドキュメント
- `cli/EXAMPLES.md` - 使用例集

## デモンストレーション

実装後、以下のデモを録画：
```bash
# 緊急投稿デモ
npm run post
# → 30秒で投稿完了

# AI生成デモ
npm run post -- --ai "React 19の新機能"
# → 2分で記事生成・投稿完了
```

---

このプロンプトをClaude CLIに渡して、段階的に実装を進めてください。
フェーズ1から開始し、各フェーズの完了後に動作確認を行ってください。
