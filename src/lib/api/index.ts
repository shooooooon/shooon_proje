import { supabase } from '@/lib/client/supabase';
import { Post } from '@/types/post';

/**
 * 統合API（現在使用中）
 * 
 * 小規模プロジェクトではこの統合版で十分です。
 * 必要に応じて _modular/ に分割版を用意しています。
 */

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  return data;
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  return data;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchPostsByAuthor(author: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author', author)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by author:', error);
    return [];
  }
  
  return data || [];
}
