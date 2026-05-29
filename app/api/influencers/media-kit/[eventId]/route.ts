import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId } = await params;
    
    // Try to get media kit for this event
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/media-kit/${eventId}`, {
      headers: getAuthHeaders(req),
      credentials: 'include',
    });
    
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    
    // If not found, create a new one
    const createRes = await fetch(`${BACKEND_URL}/api/v1/influencers/media-kit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(req),
      },
      body: JSON.stringify({
        event_id: eventId,
        name: `Media Kit for Event ${eventId}`,
        description: 'Auto-generated media kit',
        design_template: 'standard',
        is_public: false,
      }),
      credentials: 'include',
    });
    
    const data = await createRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: createRes.status });
  } catch (error) {
    console.error('Error getting media kit:', error);
    return NextResponse.json(
      { error: 'Failed to get media kit' },
      { status: 500 }
    );
  }
}
