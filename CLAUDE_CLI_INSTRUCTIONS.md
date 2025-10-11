# Claude CLIでフロントエンドを改善する手順

## ステップ1: Claude CLIの起動

```bash
cd /Users/shunsato/projects/shooon_proje
claude
```

## ステップ2: 段階的な改善プロンプト

### フェーズ1: 基礎セットアップ（shadcn/ui導入）

```
プロジェクトにshadcn/uiを導入してください。

1. 以下のコマンドを実行:
npx shadcn@latest init

設定:
- Style: New York
- Base color: Slate
- CSS variables: Yes

2. 必要なコンポーネントを追加:
npx shadcn@latest add button card input textarea badge skeleton dialog toast

3. next-themes、lucide-react、@tailwindcss/typographyをインストール:
npm install next-themes lucide-react @tailwindcss/typography

4. tailwind.config.tsにtypographyプラグインを追加してください
```

### フェーズ2: ダークモード対応

```
ダークモードを実装してください。

1. src/components/theme-provider.tsx を作成
2. src/app/layout.tsx にThemeProviderを統合
3. src/components/theme-toggle.tsx を作成（Moon/Sunアイコン使用）
4. Headerコンポーネントにテーマ切り替えボタンを追加

参考: https://ui.shadcn.com/docs/dark-mode/next
```

### フェーズ3: Headerの改善

```
src/components/Header.tsx を改善してください。

要件:
- shadcn/ui Buttonを使用
- モバイルメニュー（ハンバーガーメニュー）を追加
- ダークモード切り替えボタンを追加
- スムーズなトランジション
- Lucide Iconsを使用（Menu, X, Moon, Sun）
- レスポンシブデザイン

デザイン参考: Vercel公式サイトのヘッダー
```

### フェーズ4: PostCardの改善

```
src/components/PostCard.tsx を改善してください。

要件:
- shadcn/ui Cardコンポーネントを使用
- Badgeで著者タイプを表示（AI/CLI/Human）
- 読了時間を計算して表示（文字数 / 400文字/分）
- Lucide Iconsを使用（Clock, User, Bot, Terminal）
- ホバーエフェクト（shadow-lg、scale-105）
- カードの統一感あるデザイン

現在のPostCard.tsxの構造を維持しつつ、デザインを改善してください。
```

### フェーズ5: Footerの改善

```
src/components/Footer.tsx を改善してください。

要件:
- 3カラムレイアウトの改善（About, Links, Tech Stack）
- Lucide Iconsを使用（Github, Twitter, Mail など）
- ホバーエフェクト
- ダークモード対応
- レスポンシブ（モバイルは1カラム）

GitHubリンク、Twitterリンクなどを追加してください。
```

### フェーズ6: PostFormの改善

```
src/components/PostForm.tsx を改善してください。

要件:
- shadcn/ui Input, Textarea, Buttonを使用
- AI生成中のローディング表示を改善（Loaderアイコン）
- フォームバリデーション強化
- Toast通知の追加（成功/エラー時）
- Labelコンポーネントの使用
- フォームレイアウトの改善

Toastは shadcn/ui の Toaster を使用してください。
```

### フェーズ7: ホームページの改善

```
src/app/page.tsx を改善してください。

要件:
- ローディング状態にSkeleton表示を追加
- グリッドレイアウトの最適化（gap調整）
- ヘッダーセクションの改善（タイトル、説明文）
- 記事が0件の場合の表示改善
- レスポンシブグリッド（モバイル1列、タブレット2列、デスクトップ3列）

loading.tsx を作成してSuspenseと組み合わせてください。
```

### フェーズ8: 記事詳細ページの改善

```
src/app/posts/[slug]/page.tsx を改善してください。

要件:
- @tailwindcss/typography を使用（proseクラス）
- 読了時間の表示
- 著者情報のBadge表示
- シェアボタンの追加（Twitter, Facebook, Copy Link）
- 目次（TOC）の自動生成（h2, h3から）
- 関連記事セクション（同じ著者の記事を3件表示）
- パンくずリスト

記事本文は prose prose-slate dark:prose-invert で美しく表示してください。
```

### フェーズ9: 管理画面の改善

```
src/app/admin/page.tsx を改善してください。

要件:
- ダッシュボード統計を上部に表示（総記事数、AI投稿数、CLI投稿数、人間投稿数）
- 記事一覧をCardで表示
- Dialogで削除確認
- Toast通知の統合
- 検索・フィルター機能の追加
- ページネーション（または無限スクロール）

shadcn/ui Table, Dialog, Toastを使用してください。
```

### フェーズ10: 最終調整

```
最終調整を行ってください。

1. 全コンポーネントのダークモード対応確認
2. レスポンシブデザインの確認（モバイル/タブレット/デスクトップ）
3. アクセシビリティチェック（ARIAラベル、alt属性）
4. パフォーマンスチェック（不要なclient componentsの削減）
5. 一貫性チェック（カラー、スペーシング、フォント）

npm run build でビルドエラーがないことを確認してください。
```

## ステップ3: 動作確認

各フェーズ完了後に以下を確認:

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000
# http://localhost:3000/admin
# http://localhost:3000/posts/[任意のslug]

# ダークモードの切り替えをテスト
# モバイル表示をテスト
```

## ステップ4: ビルド確認

```bash
npm run build
npm start
```

## トラブルシューティング

### shadcn/uiのインストールに失敗
```bash
rm -rf node_modules package-lock.json
npm install
npx shadcn@latest init
```

### 型エラーが出る
```bash
npm run lint
npx tsc --noEmit
```

### スタイルが反映されない
```bash
# Tailwind CSSのキャッシュをクリア
rm -rf .next
npm run dev
```

## 完了チェックリスト

- [ ] shadcn/ui導入完了
- [ ] ダークモード実装完了
- [ ] Header改善完了
- [ ] Footer改善完了
- [ ] PostCard改善完了
- [ ] PostForm改善完了
- [ ] ホームページ改善完了
- [ ] 記事詳細ページ改善完了
- [ ] 管理画面改善完了
- [ ] レスポンシブ確認完了
- [ ] ビルド成功確認

## 補足

- 各フェーズは独立しているので、順番に実行してください
- エラーが出たら次のフェーズに進む前に解決してください
- デザインは参考サイト（Vercel Blog等）を見ながら調整してください
- 不明点があればClaude CLIに質問してください
