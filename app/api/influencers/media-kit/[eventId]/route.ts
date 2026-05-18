import { NextRequest, NextResponse } from 'next/server';
import { getMediaKit, generateMediaKitFromEvent } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId } = await params;
    
    // Try to get existing media kit, or generate a new one
    let mediaKit = getMediaKit(eventId);
    
    if (!mediaKit) {
      // Generate a new media kit from event data
      mediaKit = generateMediaKitFromEvent(eventId, userId);
    }

    return NextResponse.json(mediaKit);
  } catch (error) {
    console.error('Error getting media kit:', error);
    return NextResponse.json(
      { error: 'Failed to get media kit' },
      { status: 500 }
    );
  }
}
