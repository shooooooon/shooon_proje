# フロントエンドUIチェックガイド

バックエンド設定なしでフロントエンドのUIを確認するためのガイドです。

## ✅ 準備完了

モックデータを使用してフロントエンドのUIを確認できる状態になりています。

### 変更内容

1. **モックデータファイルの作成**: `src/lib/mock-data.ts`
   - 6件のサンプル記事（AI, CLI, Human各2件）
   - 統計情報のモックデータ
   - ヘルパー関数（スラッグ検索、著者フィルターなど）

2. **ページの修正**:
   - `src/app/page.tsx` - ホームページ（記事一覧）
   - `src/app/posts/[slug]/page.tsx` - 記事詳細ページ
   - `src/app/admin/page.tsx` - 管理画面

各ファイルに `USE_MOCK_DATA = true` フラグを追加し、モックデータモードを有効化しています。

## 🚀 UIチェックの開始

### 1. 開発サーバーの起動

```bash
cd /Users/shunsato/projects/shooon_proje
npm run dev
```

### 2. チェック項目

#### ホームページ (http://localhost:3000)

- [ ] ヘッダーが正しく表示される
- [ ] ダークモード切り替えが動作する
- [ ] モバイルメニュー（ハンバーガー）が動作する
- [ ] 6件の記事カードが表示される
- [ ] 記事カードのホバーエフェクト
- [ ] バッジ表示（AI/CLI/Human）
- [ ] 読了時間の表示
- [ ] レスポンシブレイアウト
  - モバイル: 1カラム
  - タブレット: 2カラム
  - デスクトップ: 3カラム

#### 記事詳細ページ

以下のURLで各記事を確認:
- http://localhost:3000/posts/nextjs-15-new-features
- http://localhost:3000/posts/typescript-react-type-safety
- http://localhost:3000/posts/supabase-backend-development
- http://localhost:3000/posts/tailwind-css-best-practices
- http://localhost:3000/posts/react-server-components
- http://localhost:3000/posts/cli-tool-development

チェック項目:
- [ ] 記事タイトル・著者・日付の表示
- [ ] 本文が prose スタイルで美しく表示
- [ ] 目次（TOC）の自動生成と動作
- [ ] 読了時間の表示
- [ ] シェアボタン（Twitter, Facebook, Copy Link）
- [ ] 関連記事の表示
- [ ] パンくずリストの表示
- [ ] ダークモードでの表示

#### 管理画面 (http://localhost:3000/admin)

チェック項目:
- [ ] ダッシュボード統計の表示
  - 総記事数: 6
  - AI投稿: 2
  - CLI投稿: 2
  - Human投稿: 2
- [ ] 検索機能の動作
- [ ] フィルター機能（著者タイプ）
- [ ] 記事一覧の表示
- [ ] ページネーション
- [ ] 編集・削除ボタンの表示
- [ ] 新規投稿ボタン

**注意**: 管理画面での実際の投稿・編集・削除は、モックデータモードでは動作しません（UIチェックのみ）。

### 3. レスポンシブチェック

ブラウザの開発者ツールでデバイスエミュレーション:

**モバイル** (375px):
- [ ] ハンバーガーメニューが表示される
- [ ] 1カラムレイアウト
- [ ] タッチ操作が快適

**タブレット** (768px):
- [ ] 2カラムレイアウト
- [ ] ヘッダーが適切に表示

**デスクトップ** (1280px):
- [ ] 3カラムレイアウト
- [ ] すべてのコンテンツが適切に表示

### 4. ダークモードチェック

- [ ] ヘッダーのテーマ切り替えボタンをクリック
- [ ] すべてのページでダークモードが適用される
- [ ] テキストが読みやすい
- [ ] コントラストが十分

### 5. アクセシビリティチェック

- [ ] キーボードナビゲーション（Tab キー）
- [ ] フォーカス表示が明確
- [ ] ARIA ラベルが適切
- [ ] スクリーンリーダー対応

## 📝 確認済みサンプル記事

モックデータには以下の記事が含まれています:

1. **Next.js 15の新機能を徹底解説** (Human)
2. **TypeScriptでの型安全なReact開発** (AI)
3. **Supabaseで始めるバックエンド開発** (CLI)
4. **Tailwind CSSのベストプラクティス** (Human)
5. **React Server Componentsの理解** (AI)
6. **CLIツールの開発入門** (CLI)

## 🔄 本番モードへの切り替え

UIチェックが完了したら、以下の手順で本番モードに切り替えます:

### 1. モックデータモードを無効化

以下のファイルで `USE_MOCK_DATA` を `false` に変更:

```typescript
// src/app/page.tsx
const USE_MOCK_DATA = false;

// src/app/posts/[slug]/page.tsx
const USE_MOCK_DATA = false;

// src/app/admin/page.tsx
const USE_MOCK_DATA = false;
```

### 2. Supabaseの設定

1. Supabaseプロジェクトを作成
2. `supabase-schema.sql` を実行
3. `.env.local` に実際のAPIキーを設定

### 3. 動作確認

```bash
npm run dev
```

実際のデータベースに接続して動作を確認します。

## 🐛 トラブルシューティング

### ページが真っ白

```bash
# キャッシュをクリア
rm -rf .next
npm run dev
```

### スタイルが適用されない

```bash
# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ビルドエラー

```bash
# 型エラーをチェック
npx tsc --noEmit

# ESLintエラーをチェック
npm run lint
```

## 📊 UIチェックリスト

印刷用のチェックリスト:

```
□ ホームページ表示
□ ヘッダー（デスクトップ）
□ ヘッダー（モバイル）
□ フッター
□ 記事カード
□ 記事詳細ページ
□ 目次（TOC）
□ シェアボタン
□ 管理画面
□ ダッシュボード統計
□ 検索・フィルター
□ ダークモード切り替え
□ レスポンシブ（モバイル）
□ レスポンシブ（タブレット）
□ レスポンシブ（デスクトップ）
□ アクセシビリティ
```

## 🎉 完了

すべてのチェック項目が完了したら、フロントエンドのUIは本番環境に対応可能です！
