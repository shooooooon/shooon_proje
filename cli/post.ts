#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// 環境変数の読み込み
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ エラー: 環境変数が設定されていません');
  console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function postArticle(title: string, author: string, contentPath: string) {
  try {
    // ファイルから本文を読み込む
    const fullPath = resolve(process.cwd(), contentPath);
    const content = readFileSync(fullPath, 'utf-8');

    // スラッグを生成
    const slug = generateSlug(title);

    console.log('📝 記事を投稿中...');
    console.log(`タイトル: ${title}`);
    console.log(`著者: ${author}`);
    console.log(`スラッグ: ${slug}`);

    // Supabaseに投稿
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          slug,
          content,
          author,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ 投稿が成功しました！');
    console.log(`ID: ${data.id}`);
    console.log(`URL: /posts/${data.slug}`);
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

// コマンドライン引数の解析
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('使用方法:');
  console.log('  npm run post -- <タイトル> <著者名> <コンテンツファイルパス>');
  console.log('');
  console.log('例:');
  console.log('  npm run post -- "My First Post" "John Doe" "./cli/sample-content.md"');
  process.exit(1);
}

const [title, author, contentPath] = args;

postArticle(title, author, contentPath);
