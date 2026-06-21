import { NextRequest, NextResponse } from 'next/server';
import { trackReferralConversion } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.referralCode || !data.orderId || !data.referredUserId || data.amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: referralCode, orderId, referredUserId, amount' },
        { status: 400 }
      );
    }

    trackReferralConversion(data.referralCode, data.orderId, data.referredUserId, data.amount);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking referral conversion:', error);
    return NextResponse.json(
      { error: 'Failed to track referral conversion' },
      { status: 500 }
    );
  }
}
