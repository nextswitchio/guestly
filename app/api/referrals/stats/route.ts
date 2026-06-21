import { NextRequest, NextResponse } from 'next/server';
import { getReferralStats } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;

    const stats = getReferralStats(userId, eventId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to get referral stats' },
      { status: 500 }
    );
  }
}
