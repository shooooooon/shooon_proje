# モジュラーAPI（無効化中）

現在は `lib/api/index.ts` で統合版APIを使用しています。

## 有効化方法

大規模プロジェクトになった場合、以下の手順で分割版に移行できます：

1. `_modular/` を `modular/` にリネーム:
   ```bash
   mv src/lib/api/_modular src/lib/api/modular
   ```

2. `lib/api/index.ts` を以下のように変更:
   ```typescript
   export * from './modular/posts';
   export * from './modular/tags';
   export * from './modular/categories';
   export * from './modular/search';
   ```

3. 各モジュールファイルを実装

## 無効化理由

- **小規模プロジェクト**: 現在の規模では統合版で十分
- **メンテナンス性**: ファイル数を減らしてシンプルに保つ
- **パフォーマンス**: 小規模では分割のメリットが少ない

## 分割のタイミング

以下の状況になったら分割を検討:

- API関数が50個を超えた
- ファイルサイズが500行を超えた
- 複数人での開発が始まった
- タグ・カテゴリなど新機能が追加された

## 分割版の構造例

```
api/
├── index.ts              # 統合エクスポート
└── modular/
    ├── posts.ts          # 記事関連API
    ├── tags.ts           # タグ関連API
    ├── categories.ts     # カテゴリ関連API
    ├── search.ts         # 検索関連API
    └── stats.ts          # 統計関連API
```
