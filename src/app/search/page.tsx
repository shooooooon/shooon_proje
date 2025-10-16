import { searchPosts } from '@/lib/api';
import { mockPosts } from '@/lib/data/mock-data';
import PostList from '@/components/posts/PostList';
import SearchBox from '@/components/search/SearchBox';

export const revalidate = 0;

// UIチェック用: モックデータを使用
const USE_MOCK_DATA = true;

async function performSearch(query: string) {
  if (USE_MOCK_DATA) {
    // モックデータでの簡易検索
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return mockPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
    );
  }
  return await searchPosts(query);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = q ? await performSearch(q) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          検索
        </h1>
        <SearchBox />
      </div>

      {q && (
        <div>
          <p className="text-muted-foreground mb-6">
            「<span className="font-semibold text-foreground">{q}</span>」の検索結果: {posts.length}件
          </p>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                検索結果が見つかりませんでした
              </p>
            </div>
          )}
        </div>
      )}

      {!q && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            キーワードを入力して記事を検索してください
          </p>
        </div>
      )}
    </div>
  );
}
