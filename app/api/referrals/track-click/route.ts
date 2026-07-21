import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.referralCode && !data.code) {
      return NextResponse.json({ error: 'Missing referral code' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/referrals/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: data.referralCode || data.code }),
    });

    const result = await res.json();
    return NextResponse.json({ success: true, ...result }, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
