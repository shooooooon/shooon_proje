/**
 * サイドバーコンポーネント（無効化中）
 * 
 * 有効化方法:
 * 1. このファイルを _Sidebar.tsx → Sidebar.tsx にリネーム
 * 2. layout.tsx でインポートして使用:
 *    import Sidebar from '@/components/layout/Sidebar'
 * 3. レイアウトに追加:
 *    <div className="flex">
 *      <Sidebar />
 *      <main>{children}</main>
 *    </div>
 * 
 * 無効化理由:
 * - モバイルファーストデザインのため現在は不要
 * - AIファーストのシンプルなUIを維持
 * - レスポンシブ対応を簡素化
 */

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 bg-muted/30 border-r p-6">
      <div className="space-y-6">
        {/* カテゴリセクション */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">カテゴリ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/posts/category/tech" className="text-muted-foreground hover:text-foreground">
                技術記事
              </a>
            </li>
            <li>
              <a href="/posts/category/tutorial" className="text-muted-foreground hover:text-foreground">
                チュートリアル
              </a>
            </li>
            <li>
              <a href="/posts/category/news" className="text-muted-foreground hover:text-foreground">
                ニュース
              </a>
            </li>
          </ul>
        </div>

        {/* タグクラウド */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">人気のタグ</h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-muted px-2 py-1 rounded">Next.js</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">React</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">TypeScript</span>
            <span className="text-xs bg-muted px-2 py-1 rounded">AI</span>
          </div>
        </div>

        {/* アーカイブ */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">アーカイブ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/posts/archive/2025-01" className="text-muted-foreground hover:text-foreground">
                2025年1月
              </a>
            </li>
            <li>
              <a href="/posts/archive/2024-12" className="text-muted-foreground hover:text-foreground">
                2024年12月
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
