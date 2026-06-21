import { NextRequest, NextResponse } from 'next/server';
import { scheduleAutoPost } from '@/lib/marketing';

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
    const { eventId, platforms, eventData } = body;

    if (!eventId || !platforms || !Array.isArray(platforms) || !eventData) {
      return NextResponse.json(
        { error: 'Event ID, platforms array, and eventData are required' },
        { status: 400 }
      );
    }

    const result = await scheduleAutoPost(eventId, platforms, eventData);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error enabling auto-post:', error);
    return NextResponse.json(
      { error: 'Failed to enable auto-post' },
      { status: 500 }
    );
  }
}
