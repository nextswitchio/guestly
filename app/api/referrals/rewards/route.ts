import { NextRequest, NextResponse } from 'next/server';
import { getReferralStats, getAllReferralLinks } from '@/lib/marketing';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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

    // Fetch event titles from backend for each link
    const linksWithTitles = await Promise.all(
      userLinks.map(async (l) => {
        let eventTitle = `Event #${l.eventId}`;
        try {
          const response = await fetch(`${BACKEND_URL}/api/v1/events/${l.eventId}`);
          if (response.ok) {
            const event = await response.json();
            eventTitle = event.title;
          }
        } catch (err) {
          console.error(`Failed to fetch event ${l.eventId}:`, err);
        }
        
        return {
          id: l.id,
          eventId: l.eventId,
          eventTitle,
          url: l.url,
          code: l.code,
          clicks: l.clicks,
          conversions: l.conversions,
          earnedRewards: l.earnedRewards,
          pendingRewards: l.pendingRewards,
          createdAt: l.createdAt,
        };
      })
    );

    return NextResponse.json({
      stats,
      links: linksWithTitles,
    });
  } catch (error) {
    console.error('Error getting referral rewards:', error);
    return NextResponse.json(
      { error: 'Failed to get referral rewards' },
      { status: 500 }
    );
  }
}
