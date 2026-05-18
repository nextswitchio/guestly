import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = getBlogPost(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error getting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to get blog post' },
      { status: 500 }
    );
  }
}
