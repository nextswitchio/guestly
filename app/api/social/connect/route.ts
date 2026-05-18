import { NextRequest, NextResponse } from 'next/server';
import { connectSocialAccount, type SocialPlatform } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizerId, platform, credentials } = body;

    if (!organizerId || !platform || !credentials) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = connectSocialAccount(
      organizerId,
      platform as SocialPlatform,
      credentials
    );

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error: any) {
    console.error('Social connect error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect account' },
      { status: 500 }
    );
  }
}
