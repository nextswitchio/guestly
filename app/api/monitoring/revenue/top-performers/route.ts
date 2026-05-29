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
    const { searchParams } = req.nextUrl;
    const limit = searchParams.get('limit') || '10';
    const metric = searchParams.get('metric') || 'revenue';
    
    const res = await fetch(`${BACKEND_URL}/api/v1/monitoring/revenue/top-performers?limit=${limit}&metric=${metric}`, {
      headers: getAuthHeaders(req),
      credentials: 'include',
      cache: 'no-store',
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top performers' },
      { status: 500 }
    );
  }
}
