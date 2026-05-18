import { NextRequest, NextResponse } from 'next/server';
import {
  getMessageThread,
  sendInfluencerMessage,
  getInfluencerMessages,
  markMessagesAsRead,
  getInfluencerCollaboration,
} from '@/lib/marketing';

// GET /api/influencers/collaborations/[id]/messages - Get messages for collaboration
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: collaborationId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Verify user is part of the collaboration
    const collaboration = getInfluencerCollaboration(collaborationId);
    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    if (collaboration.organizerId !== userId && collaboration.influencerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = getInfluencerMessages(collaborationId, limit, offset);
    const thread = getMessageThread(collaborationId);

    return NextResponse.json({
      messages,
      unreadCount: thread ? (
        userId === collaboration.organizerId 
          ? thread.unreadCount.organizer 
          : thread.unreadCount.influencer
      ) : 0,
      total: thread?.messages.length || 0,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/influencers/collaborations/[id]/messages - Send message
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
    const { content, attachments } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Verify user is part of the collaboration
    const collaboration = getInfluencerCollaboration(collaborationId);
    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    if (collaboration.organizerId !== userId && collaboration.influencerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = sendInfluencerMessage(
      collaborationId,
      userId,
      content,
      attachments
    );

    if (!message) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
