import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/marketing';

export async function GET() {
  try {
    const posts = getAllBlogPosts().filter(post => post.status === 'published');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Guestly Blog</title>
    <link>https://guestly.com</link>
    <description>Latest news, tips, and updates from Guestly</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://guestly.com/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://guestly.com/blog/${post.slug}</link>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <guid>https://guestly.com/blog/${post.slug}</guid>
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Failed to generate RSS feed:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
