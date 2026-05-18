import { NextRequest, NextResponse } from 'next/server';
import { publishBlogPost } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const post = publishBlogPost(id);

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error publishing blog post:', error);
    return NextResponse.json(
      { error: 'Failed to publish blog post' },
      { status: 500 }
    );
  }
}
