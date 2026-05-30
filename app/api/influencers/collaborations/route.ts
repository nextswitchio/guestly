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
    influencerName: raw.influencer_name ?? raw.influencerName ?? '',
    influencerPlatform: raw.influencer_platform ?? raw.influencerPlatform ?? 'instagram',
    influencerHandle: raw.influencer_handle ?? raw.influencerHandle ?? '',
    influencerEmail: raw.influencer_email ?? raw.influencerEmail ?? '',
    influencerAvatar: raw.influencer_avatar ?? raw.influencerAvatar ?? '',
    eventName: raw.event_name ?? raw.eventName ?? 'Unknown Event',
    compensationType: raw.compensation_type ?? raw.compensationType ?? 'fixed-payment',
    compensationValue:
      raw.compensation_value ??
      raw.compensationValue ??
      raw.compensation_amount ??
      raw.free_ticket_count ??
      raw.commission_rate ??
      '',
    deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : [],
    completedDeliverables: Array.isArray(raw.completed_deliverables)
      ? raw.completed_deliverables
      : Array.isArray(raw.completedDeliverables)
      ? raw.completedDeliverables
      : [],
    deadline: raw.deadline ?? raw.deadline_date ?? '',
    trackingLink: raw.tracking_link ?? raw.trackingLink ?? '',
    promoCode: raw.promo_code ?? raw.promoCode ?? '',
    metrics: {
      reach: raw.metrics?.reach ?? 0,
      clicks: raw.metrics?.clicks ?? 0,
      conversions: raw.metrics?.conversions ?? 0,
      revenue: raw.metrics?.revenue ?? 0,
    },
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
