import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collaborationId } = await params;
    const body = await req.json().catch(() => ({}));
    
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations/${collaborationId}/track-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error tracking collaboration click:', error);
    return NextResponse.json(
      { error: 'Failed to track collaboration click' },
      { status: 500 }
    );
  }
}
