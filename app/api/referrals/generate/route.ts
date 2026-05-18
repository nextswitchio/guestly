import { NextRequest, NextResponse } from 'next/server';
import { generateReferralLink } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.eventId) {
      return NextResponse.json(
        { error: 'Missing required field: eventId' },
        { status: 400 }
      );
    }

    const referralLink = generateReferralLink(userId, data.eventId);

    return NextResponse.json(referralLink, { status: 201 });
  } catch (error) {
    console.error('Error generating referral link:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral link' },
      { status: 500 }
    );
  }
}
