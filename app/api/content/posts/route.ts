import { NextRequest, NextResponse } from 'next/server';
import { createBlogPost, listBlogPosts, getAllBlogPosts } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const post = createBlogPost(organizerId, body);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const userId = req.cookies.get('user_id')?.value;

    // Public access for event-specific queries (community page)
    if (eventId) {
      const allPosts = getAllBlogPosts();
      const filtered = allPosts.filter(
        (p) => p.eventId === eventId && p.status === 'published'
      );
      return NextResponse.json({ posts: filtered });
    }

    // Authenticated access for organizer's own posts
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const posts = listBlogPosts(userId);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to list blog posts' },
      { status: 500 }
    );
  }
}
