import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

// GET /api/posts - すべての投稿を取得
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/posts - 新しい投稿を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert([{ title, slug, content, author }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
