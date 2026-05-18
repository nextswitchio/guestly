import { NextRequest, NextResponse } from 'next/server';
import { trackReferralClick } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.referralCode) {
      return NextResponse.json(
        { error: 'Missing required field: referralCode' },
        { status: 400 }
      );
    }

    const metadata = {
      userAgent: req.headers.get('user-agent') || undefined,
      referer: req.headers.get('referer') || undefined,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      ...data.metadata,
    };

    trackReferralClick(data.referralCode, metadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking referral click:', error);
    return NextResponse.json(
      { error: 'Failed to track referral click' },
      { status: 500 }
    );
  }
}
