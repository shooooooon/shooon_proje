import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/stats - ブログ統計を取得
export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    const { data: recentPosts } = await supabaseAdmin
      .from('posts')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    const stats = {
      totalPosts: count || 0,
      recentPostsCount: recentPosts?.length || 0,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
