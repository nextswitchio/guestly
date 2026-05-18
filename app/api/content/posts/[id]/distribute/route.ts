import { NextRequest, NextResponse } from 'next/server';
import { distributeBlogPost } from '@/lib/marketing';

/**
 * POST /api/content/posts/[id]/distribute
 * Distribute a blog post across multiple channels
 * Requirements: 16.3 - Automatic distribution via email newsletter, social media, and RSS feed
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await req.json();
    const { channels } = body;

    // Validate channels
    if (!channels || !Array.isArray(channels)) {
      return NextResponse.json(
        { error: 'Channels array is required' },
        { status: 400 }
      );
    }

    const validChannels = ['email', 'social', 'rss'];
    const invalidChannels = channels.filter((ch: string) => !validChannels.includes(ch));
    
    if (invalidChannels.length > 0) {
      return NextResponse.json(
        { error: `Invalid channels: ${invalidChannels.join(', ')}. Valid channels are: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    // Distribute the blog post
    const result = await distributeBlogPost(postId, channels);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Distribution failed', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error distributing blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
