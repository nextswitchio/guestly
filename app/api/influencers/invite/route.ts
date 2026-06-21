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

    // Convert camelCase from frontend → snake_case for backend schema
    const payload = {
      event_id: body.eventId,
      influencer_id: body.influencerId,
      influencer_name: body.influencerName,
      influencer_platform: body.influencerPlatform ?? null,
      influencer_handle: body.influencerHandle ?? null,
      compensation_type: body.compensationType,
      compensation_amount: body.compensationAmount ?? null,
      commission_rate: body.commissionRate ?? null,
      free_ticket_count: body.freeTicketCount ?? null,
      tracking_code: body.trackingCode ?? null,
      promo_code: body.promoCode ?? null,
    };

    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => ({}));
    return NextResponse.json(normalizeCollab(raw), { status: res.status });
  } catch (error) {
    console.error('Error inviting influencer:', error);
    return NextResponse.json({ error: 'Failed to invite influencer' }, { status: 500 });
  }
}
