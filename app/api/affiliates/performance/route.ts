import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value;
    const userId = req.cookies.get('user_id')?.value;
    if (!token || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const range = req.nextUrl.searchParams.get('range') || '30d';

    const response = await fetch(
      `${BACKEND_URL}/api/v1/affiliates/performance?user_id=${userId}&range=${range}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch affiliate performance' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Affiliate performance service unavailable' },
      { status: 503 }
    );
  }
}
