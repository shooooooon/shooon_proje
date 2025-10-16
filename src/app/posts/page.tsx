import { fetchPosts } from '@/lib/api';
import { mockPosts } from '@/lib/data/mock-data';
import PostList from '@/components/posts/PostList';

export const revalidate = 0;

// UIチェック用: モックデータを使用
const USE_MOCK_DATA = true;

async function getAllPosts() {
  if (USE_MOCK_DATA) {
    return mockPosts;
  }
  return await fetchPosts();
}

export default async function PostsPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          全記事
        </h1>
        <p className="text-muted-foreground">
          {posts.length}件の記事があります
        </p>
      </div>
      
      <PostList posts={posts} />
      
      {/* ページネーションは将来実装 */}
    </div>
  );
}
