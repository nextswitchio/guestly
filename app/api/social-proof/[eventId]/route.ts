import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';
import { getSocialProofData } from '@/lib/marketing';

function getAuth(request: NextRequest): Record<string, string> {
  const token = request.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;

    // Try to fetch real data from backend
    const auth = getAuth(req);

    // Fetch event details (for ticket capacity)
    const eventRes = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}`, {
      headers: { ...auth, "Content-Type": "application/json" },
    });

    // Fetch reviews
    const reviewsRes = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/reviews`, {
      headers: { ...auth, "Content-Type": "application/json" },
    });

    let ticketsSold = 0;
    let totalCapacity = 0;
    let reviews: any[] = [];

    if (eventRes.ok) {
      const eventData = await eventRes.json();
      const ev = eventData.data ?? eventData;
      if (ev.tickets) {
        for (const t of ev.tickets) {
          totalCapacity += t.total ?? t.available ?? 0;
          ticketsSold += (t.total ?? 0) - (t.available ?? 0);
        }
      }
    }

    if (reviewsRes.ok) {
      const data = await reviewsRes.json();
      reviews = Array.isArray(data) ? data : data.reviews ?? [];
    }

    const averageRating = reviews.length > 0
      ? reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length
      : 0;

    const percentageSold = totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0;

    // Check in-memory data as fallback
    const inMemory = getSocialProofData(eventId);

    return NextResponse.json({
      eventId,
      ticketsSold,
      totalCapacity,
      percentageSold,
      recentPurchases: inMemory?.recentPurchases ?? [],
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      organizerStats: {
        totalEvents: 0,
        totalAttendees: 0,
        averageRating,
        yearsActive: 0,
        verified: false,
      },
      scarcityLevel: totalCapacity > 0
        ? (percentageSold >= 90 ? 'high' : percentageSold >= 70 ? 'medium' : percentageSold > 0 ? 'low' : 'none')
        : 'none',
      trustScore: Math.round(
        Math.min(30, (ticketsSold / 100) * 30) +
        Math.min(30, (averageRating / 5) * 30) +
        0
      ),
    });
  } catch (error) {
    console.error('Error in social proof API:', error);
    // Fallback to in-memory data
    const { eventId } = await params;
    const inMemory = getSocialProofData(eventId);
    if (inMemory) return NextResponse.json(inMemory);
    return NextResponse.json(
      { error: 'Failed to get social proof data' },
      { status: 500 }
    );
  }
}
