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

    const stats = getReferralStats(userId);

    // Return rewards summary
    const rewards = {
      totalEarned: stats.totalEarned,
      pendingRewards: stats.pendingRewards,
      totalConversions: stats.totalConversions,
      totalRevenue: stats.totalRevenue,
    };

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error getting referral rewards:', error);
    return NextResponse.json(
      { error: 'Failed to get referral rewards' },
      { status: 500 }
    );
  }
}
