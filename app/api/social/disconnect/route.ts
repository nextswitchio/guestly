import { NextRequest, NextResponse } from 'next/server';
import { disconnectSocialAccount } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { platform } = body;

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      );
    }

    disconnectSocialAccount(userId, platform);

    return NextResponse.json({
      success: true,
      message: 'Account disconnected successfully',
    });
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect social account' },
      { status: 500 }
    );
  }
}
