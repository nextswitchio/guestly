import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const qs = new URLSearchParams();
  if (searchParams.get('q')) qs.set('q', searchParams.get('q')!);
  if (searchParams.get('city')) qs.set('city', searchParams.get('city')!);
  if (searchParams.get('country')) qs.set('country', searchParams.get('country')!);
  if (searchParams.get('page')) qs.set('page', searchParams.get('page')!);
  if (searchParams.get('page_size')) qs.set('page_size', searchParams.get('page_size')!);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/discover?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 });
  }
}
