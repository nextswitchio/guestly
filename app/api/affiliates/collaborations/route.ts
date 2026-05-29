import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJSON(url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeaders = getAuthHeaders(req);
    if (!authHeaders.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all collaborations where the current user is the influencer
    const raw = await fetchJSON(`${BACKEND_URL}/api/v1/influencers/collaborations`, authHeaders);
    const rawList: any[] = Array.isArray(raw) ? raw : [];

    // Get current user id so we can filter to only collabs where they are the influencer
    const me = await fetchJSON(`${BACKEND_URL}/api/v1/users/me`, authHeaders);
    const myId = me?.id ?? null;

    // Only keep records where this user is the influencer (incoming invitations)
    const incoming = myId ? rawList.filter((c: any) => c.influencer_id === myId) : rawList;

    // Enrich each collab with event + organizer details in parallel
    const collaborations = await Promise.all(
      incoming.map(async (c) => {
        const [eventData, organizerData] = await Promise.all([
          fetchJSON(`${BACKEND_URL}/api/v1/events/${c.event_id}`, authHeaders),
          fetchJSON(`${BACKEND_URL}/api/v1/users/${c.organizer_id}`, authHeaders),
        ]);

        return {
          id: c.id,
          eventId: c.event_id,
          organizerId: c.organizer_id,
          eventName: eventData?.title ?? 'Unknown Event',
          eventDate: eventData?.date ?? '',
          eventImage: eventData?.image ?? eventData?.banner_image ?? null,
          organizerName: organizerData?.display_name ?? 'Unknown Organizer',
          status: c.status,                          // keep raw: invited / accepted / declined
          compensationType: c.compensation_type ?? 'paid',
          compensationAmount: c.compensation_amount ?? null,
          commissionRate: c.commission_rate ?? null,
          freeTicketCount: c.free_ticket_count ?? null,
          trackingCode: c.tracking_code ?? '',
          promoCode: c.promo_code ?? null,
          deliverables: [],                          // not stored yet — placeholder
          invitedAt: c.invited_at,
          acceptedAt: c.accepted_at ?? null,
          message: null,
        };
      })
    );

    return NextResponse.json({ collaborations });
  } catch (error) {
    console.error('Error fetching affiliate collaborations:', error);
    return NextResponse.json({ collaborations: [] }, { status: 500 });
  }
}
