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
    const period = searchParams.get('period') || '30d';
    const groupBy = searchParams.get('group_by') || null;
    
    let url = `${BACKEND_URL}/api/v1/monitoring/revenue/analytics?period=${period}`;
    if (groupBy) {
      url += `&group_by=${groupBy}`;
    }
    
    const res = await fetch(url, {
      headers: getAuthHeaders(req),
      credentials: 'include',
      cache: 'no-store',
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}
