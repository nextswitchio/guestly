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
    let organizerStats: any = { totalEvents: 0, totalAttendees: 0, verified: false };
    let reviews: any[] = [];

    if (eventRes.ok) {
      const eventData = await eventRes.json();
      const ev = eventData.data ?? eventData;
      
      // Use backend's tickets_sold if available
      if (ev.tickets_sold !== undefined) {
        ticketsSold = ev.tickets_sold ?? 0;
      }
      
      // Use event capacity if available, otherwise calculate from tickets
      if (ev.capacity !== undefined) {
        totalCapacity = ev.capacity ?? 0;
      } else if (ev.tickets) {
        for (const t of ev.tickets) {
          totalCapacity += t.total ?? t.available ?? 0;
        }
      }
      
      // Use organizer stats from backend if available
      if (ev.organizer_total_attendees !== undefined) {
        organizerStats.totalAttendees = ev.organizer_total_attendees ?? 0;
      }
      if (ev.organizer_total_events !== undefined) {
        organizerStats.totalEvents = ev.organizer_total_events ?? 0;
      }
      if (ev.organizer_verified !== undefined) {
        organizerStats.verified = ev.organizer_verified ?? false;
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
        totalEvents: organizerStats.totalEvents,
        totalAttendees: organizerStats.totalAttendees,
        averageRating,
        yearsActive: 0,
        verified: organizerStats.verified,
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
