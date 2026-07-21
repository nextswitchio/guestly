import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [linksRes, statsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BACKEND_URL}/api/v1/referrals/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const links = linksRes.ok ? await linksRes.json() : [];
    const stats = statsRes.ok ? await statsRes.json() : {};

    return NextResponse.json({ links, stats });
  } catch {
    return NextResponse.json({ error: 'Failed to get referral data' }, { status: 500 });
  }
}
