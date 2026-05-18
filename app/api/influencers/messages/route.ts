import { NextRequest, NextResponse } from 'next/server';
import {
  getUserMessageThreads,
  getUnreadMessageCount,
} from '@/lib/marketing';

// GET /api/influencers/messages - Get all message threads for user
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const threads = getUserMessageThreads(userId);
    const unreadCount = getUnreadMessageCount(userId);

    return NextResponse.json({
      threads,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching message threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message threads' },
      { status: 500 }
    );
  }
}
