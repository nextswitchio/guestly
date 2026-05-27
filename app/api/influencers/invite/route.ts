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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => ({}));
    return NextResponse.json(normalizeCollab(raw), { status: res.status });
  } catch (error) {
    console.error('Error inviting influencer:', error);
    return NextResponse.json({ error: 'Failed to invite influencer' }, { status: 500 });
  }
}
