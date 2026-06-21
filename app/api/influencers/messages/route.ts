import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeStatus(status: string) {
  return status === 'invited' ? 'pending' : status === 'declined' ? 'rejected' : status;
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations`, {
      method: 'GET',
      headers: getAuthHeaders(req),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => ([]));
    const collaborations = Array.isArray(raw) ? raw : raw.collaborations || [];
    const threads = collaborations.map((rawCollab: any) => ({
      collaborationId: rawCollab.id,
      eventId: rawCollab.event_id,
      influencerId: rawCollab.influencer_id,
      organizerId: rawCollab.organizer_id,
      influencerName: rawCollab.influencer_name,
      influencerHandle: rawCollab.influencer_handle,
      status: normalizeStatus(rawCollab.status),
      unreadCount: {
        organizer: 0,
        influencer: 0,
      },
    }));

    return NextResponse.json({ threads, unreadCount: 0 }, { status: res.status });
  } catch (error) {
    console.error('Error fetching message threads:', error);
    return NextResponse.json({ threads: [], unreadCount: 0 }, { status: 500 });
  }
}
