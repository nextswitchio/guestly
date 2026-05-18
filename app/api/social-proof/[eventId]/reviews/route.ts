import { NextRequest, NextResponse } from 'next/server';
import { getEventReviews } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const reviews = getEventReviews(eventId);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error getting event reviews:', error);
    return NextResponse.json(
      { error: 'Failed to get event reviews' },
      { status: 500 }
    );
  }
}
