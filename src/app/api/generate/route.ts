import { NextRequest, NextResponse } from 'next/server';

// POST /api/generate - AI記事生成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider = 'openai' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // OpenAI使用
    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional blog writer. Generate well-structured, engaging blog content in Japanese.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      return NextResponse.json({ content, provider: 'openai' });
    }

    // Anthropic使用
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Anthropic API key not configured' },
          { status: 500 }
        );
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: `You are a professional blog writer. Generate well-structured, engaging blog content in Japanese.\n\n${prompt}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Anthropic API request failed');
      }

      const data = await response.json();
      const content = data.content[0].text;

      return NextResponse.json({ content, provider: 'anthropic' });
    }

    return NextResponse.json(
      { error: 'Invalid provider. Use "openai" or "anthropic"' },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
