import { NextRequest, NextResponse } from 'next/server';
import { getReferralStats, getAllReferralLinks } from '@/lib/marketing';

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
    const allLinks = getAllReferralLinks();
    const userLinks = allLinks.filter(l => l.userId === userId);

    const links = userLinks.map((l) => ({
      id: l.id,
      eventId: l.eventId,
      eventTitle: l.eventTitle || `Event #${l.eventId}`,
      url: l.url,
      code: l.code,
      clicks: l.clicks,
      conversions: l.conversions,
      earnedRewards: l.earnedRewards,
      pendingRewards: l.pendingRewards,
      createdAt: l.createdAt,
    }));

    return NextResponse.json({ stats, links });
  } catch (error) {
    console.error('Error getting referral rewards:', error);
    return NextResponse.json(
      { error: 'Failed to get referral rewards' },
      { status: 500 }
    );
  }
}
