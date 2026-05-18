import { NextRequest, NextResponse } from 'next/server';
import { installRetargetingPixel } from '@/lib/marketing';

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
    const { eventId, platform, pixelId } = body;

    if (!eventId || !platform || !pixelId) {
      return NextResponse.json(
        { error: 'Event ID, platform, and pixel ID are required' },
        { status: 400 }
      );
    }

    const pixel = installRetargetingPixel(eventId, platform, pixelId);

    return NextResponse.json({
      success: true,
      pixel,
    });
  } catch (error) {
    console.error('Error installing retargeting pixel:', error);
    return NextResponse.json(
      { error: 'Failed to install retargeting pixel' },
      { status: 500 }
    );
  }
}
