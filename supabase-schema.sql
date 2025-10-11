-- Modern Blog Prototype Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author TEXT NOT NULL CHECK (author IN ('AI', 'CLI', 'Human')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all posts
CREATE POLICY "Posts are viewable by everyone" 
    ON posts FOR SELECT 
    USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts" 
    ON posts FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own posts
CREATE POLICY "Users can update posts" 
    ON posts FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete posts
CREATE POLICY "Users can delete posts" 
    ON posts FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Create a function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(title, '[^a-zA-Z0-9\s\-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO posts (title, slug, content, author) VALUES 
(
    'Welcome to Modern Blog',
    'welcome-to-modern-blog',
    '# Welcome to Modern Blog

This is a sample blog post created with our modern blog prototype. This system supports three different ways to create content:

## AI-Powered Content Creation
Use our AI API to automatically generate and publish blog posts.

## CLI Publishing
Publish directly from your command line using our TypeScript CLI tool.

## Web Interface
Use the admin interface for traditional web-based content creation.

## Features
- **Next.js 14** with App Router
- **Supabase** for backend services
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **SEO Optimized** with static regeneration

This prototype demonstrates how modern web technologies can create a flexible, scalable blogging platform.',
    'Human'
),
(
    'Getting Started with AI Content',
    'getting-started-with-ai-content',
    '# Getting Started with AI Content

Our AI-powered content generation makes it easy to create high-quality blog posts automatically.

## How It Works

1. Send a POST request to `/api/generate`
2. Include your content prompt
3. The AI generates and publishes the post automatically

## Example Usage

```bash
curl -X POST https://your-domain.com/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Write about the future of web development\"}"
```

The system supports both OpenAI and Claude APIs for maximum flexibility.',
    'AI'
),
(
    'CLI Publishing Made Simple',
    'cli-publishing-made-simple',
    '# CLI Publishing Made Simple

Publishing from the command line has never been easier with our TypeScript CLI tool.

## Quick Start

```bash
npm run post "Your Title" "Your content here"
```

## Advanced Usage

The CLI tool supports:
- Markdown content
- Automatic slug generation
- Type-safe operations
- Direct Supabase integration

Perfect for developers who prefer command-line workflows.',
    'CLI'
);

-- Create a view for post statistics
CREATE VIEW post_stats AS
SELECT 
    author,
    COUNT(*) as post_count,
    MIN(created_at) as first_post,
    MAX(created_at) as latest_post
FROM posts 
GROUP BY author;
