import { NextRequest, NextResponse } from 'next/server';
import { listInfluencerCollaborations } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // List all collaborations for this organizer (includes invited, accepted, etc.)
    const invitations = listInfluencerCollaborations(userId);

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error listing invitations:', error);
    return NextResponse.json(
      { error: 'Failed to list invitations' },
      { status: 500 }
    );
  }
}
