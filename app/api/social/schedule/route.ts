import { NextRequest, NextResponse } from 'next/server';
import { scheduleSocialPost } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { platform, content, scheduledAt } = body;

    if (!platform || !content || !scheduledAt) {
      return NextResponse.json(
        { error: 'Platform, content, and scheduledAt are required' },
        { status: 400 }
      );
    }

    const result = await scheduleSocialPost(userId, platform, content, scheduledAt);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error scheduling social post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule social post' },
      { status: 500 }
    );
  }
}
