# フロントエンド改善プロンプト（Claude CLI用）

以下のプロンプトをClaude CLIに渡して、ブログのフロントエンドを改善してください。

---

## プロジェクト概要

Next.js 15 + Supabase + Tailwind CSSで構築されたブログシステムのフロントエンドを改善してください。

**プロジェクトパス**: `/Users/shunsato/projects/shooon_proje`

## 現在の構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ（記事一覧）
│   ├── posts/[slug]/page.tsx  # 記事詳細ページ
│   └── admin/page.tsx      # 管理画面
├── components/
│   ├── Header.tsx          # ヘッダー
│   ├── Footer.tsx          # フッター
│   ├── PostCard.tsx        # 記事カード
│   └── PostForm.tsx        # 投稿フォーム
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── post.ts
```

## 改善タスク

### 1. shadcn/uiの導入と設定

```bash
npx shadcn@latest init
```

設定時の選択:
- Style: New York
- Base color: Slate
- CSS variables: Yes

以下のコンポーネントを追加:
```bash
npx shadcn@latest add button card input textarea badge skeleton dialog toast
```

### 2. コンポーネントの改善

#### Header.tsx
- shadcn/ui Button を使用
- モバイルメニューの追加（ハンバーガーメニュー）
- スムーズなトランジション
- ダークモード切り替えボタン（next-themesを使用）

#### Footer.tsx
- 3カラムレイアウトの改善
- ソーシャルリンクアイコンの追加（Lucide Icons使用）
- ホバーエフェクトの追加

#### PostCard.tsx
- shadcn/ui Card コンポーネントを使用
- ホバー時のエレベーション効果
- Badge で著者タイプ表示（AI/CLI/Human）
- 読了時間の表示（contentの文字数から計算）
- Skeletonローディング状態の追加

#### PostForm.tsx
- shadcn/ui Input, Textarea, Button を使用
- フォームバリデーション強化
- AI生成中のローディング表示改善
- Toast通知の追加

### 3. ページの改善

#### page.tsx（ホーム）
- グリッドレイアウトの最適化
- ローディング状態にSkeleton表示
- 検索・フィルター機能の追加
- ページネーションまたは無限スクロール

#### posts/[slug]/page.tsx（記事詳細）
- @tailwindcss/typography プラグインを使用
- 目次（Table of Contents）の自動生成
- 読了時間の表示
- シェアボタンの追加
- 関連記事の表示

#### admin/page.tsx（管理画面）
- ダッシュボードUIの追加（統計情報）
- 記事一覧のテーブル表示改善
- Dialog での編集・削除確認
- Toast通知の統合

### 4. ダークモードの実装

```bash
npm install next-themes
```

- `src/components/theme-provider.tsx` を作成
- layout.tsx に ThemeProvider を追加
- ヘッダーにダークモード切り替えボタンを追加

### 5. アイコンの追加

```bash
npm install lucide-react
```

以下のアイコンを適切な箇所に配置:
- Menu, X (ハンバーガーメニュー)
- Moon, Sun (ダークモード切り替え)
- Share2 (シェアボタン)
- Clock (読了時間)
- User, Bot, Terminal (著者タイプ)
- Edit, Trash2 (管理画面アクション)

### 6. レスポンシブデザインの強化

- モバイル: 1カラム
- タブレット: 2カラム
- デスクトップ: 3カラム
- ヘッダーのモバイル対応
- フッターのモバイルレイアウト

### 7. マイクロインタラクション

- ボタンのホバー・アクティブ状態
- カードのホバーエフェクト
- ページ遷移のアニメーション
- フォーム送信時のローディングアニメーション

### 8. アクセシビリティ

- 適切なARIAラベル
- キーボードナビゲーション
- フォーカス表示の改善
- セマンティックHTML

## 実装の優先順位

1. **High Priority**:
   - shadcn/ui導入
   - PostCard, Header, Footerの改善
   - ダークモード実装

2. **Medium Priority**:
   - 記事詳細ページの改善
   - 管理画面のUI改善
   - ローディング状態

3. **Low Priority**:
   - アニメーション
   - 検索・フィルター
   - 関連記事表示

## 注意事項

- **既存の機能を壊さない**: 現在動作している機能は維持してください
- **型安全性**: TypeScriptの型エラーが出ないようにしてください
- **パフォーマンス**: 不要なクライアントコンポーネント化を避けてください
- **一貫性**: デザインシステムを統一してください

## 参考デザイン

以下のサイトを参考にしてください:
- Vercel Blog: https://vercel.com/blog
- Lee Robinson's Blog: https://leerob.io/
- shadcn/ui: https://ui.shadcn.com/

## 実行方法

1. プロジェクトディレクトリに移動:
```bash
cd /Users/shunsato/projects/shooon_proje
```

2. まずshadcn/uiをセットアップ:
```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge skeleton dialog toast
```

3. 次に必要なパッケージをインストール:
```bash
npm install next-themes lucide-react @tailwindcss/typography
```

4. コンポーネントを順次改善していってください

## 期待する成果物

- モダンで洗練されたUI
- ダークモード対応
- レスポンシブデザイン
- 優れたUX（ローディング状態、エラーハンドリング）
- アクセシブルなインターフェース

## 追加要望

改善が完了したら、以下を提供してください:
1. 変更したファイルのリスト
2. 新しく追加した機能の説明
3. 使用したshadcn/uiコンポーネントのリスト
4. スクリーンショットやデモ（可能であれば）

---

このプロンプトをClaude CLIに渡して、段階的に改善を進めてください。
