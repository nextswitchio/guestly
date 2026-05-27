import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeCollab(raw: any) {
  return {
    id: raw.id,
    eventId: raw.event_id,
    organizerId: raw.organizer_id,
    influencerId: raw.influencer_id,
    influencerName: raw.influencer_name,
    influencerPlatform: raw.influencer_platform,
    influencerHandle: raw.influencer_handle,
    compensationType: raw.compensation_type,
    compensationAmount: raw.compensation_amount,
    commissionRate: raw.commission_rate,
    freeTicketCount: raw.free_ticket_count,
    trackingCode: raw.tracking_code,
    promoCode: raw.promo_code,
    status: raw.status === 'invited' ? 'pending' : raw.status === 'declined' ? 'rejected' : raw.status,
    invitedAt: raw.invited_at,
    acceptedAt: raw.accepted_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations`, {
      method: 'GET',
      headers: getAuthHeaders(req),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => []);
    const collaborations = Array.isArray(raw) ? raw.map(normalizeCollab) : [];
    return NextResponse.json({ collaborations }, { status: res.status });
  } catch (error) {
    console.error('Error listing collaborations:', error);
    return NextResponse.json({ collaborations: [] }, { status: 500 });
  }
}
