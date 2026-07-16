import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations`, {
      headers: getAuthHeaders(req),
      credentials: 'include',
    });
    
    const data = await res.json().catch((err) => { console.error("Failed to parse invitations response:", err); return []; });
    const collaborations = Array.isArray(data) ? data : data.collaborations || [];
    
    return NextResponse.json({ invitations: collaborations }, { status: res.status });
  } catch (error) {
    console.error('Error listing invitations:', error);
    return NextResponse.json(
      { error: 'Failed to list invitations' },
      { status: 500 }
    );
  }
}
