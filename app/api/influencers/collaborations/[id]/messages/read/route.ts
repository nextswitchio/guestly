import { NextRequest, NextResponse } from 'next/server';
import {
  markMessagesAsRead,
  getInfluencerCollaboration,
} from '@/lib/marketing';

// POST /api/influencers/collaborations/[id]/messages/read - Mark messages as read
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: collaborationId } = await params;
    const body = await req.json();
    const { messageIds } = body; // Optional: specific message IDs to mark as read

    // Verify user is part of the collaboration
    const collaboration = getInfluencerCollaboration(collaborationId);
    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    if (collaboration.organizerId !== userId && collaboration.influencerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const markedCount = markMessagesAsRead(collaborationId, userId, messageIds);

    return NextResponse.json({
      success: true,
      markedCount,
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
