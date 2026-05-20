import { NextRequest, NextResponse } from 'next/server';
import { listInfluencerCollaborations, acceptInfluencerInvitation, updateInfluencerStatus } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collaborations = listInfluencerCollaborations(userId);
    const affiliateCollaborations = collaborations.filter(c => c.influencerId === userId);

    return NextResponse.json({ collaborations: affiliateCollaborations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { collaborationId, action } = body;

    if (!collaborationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'accept') {
      const result = acceptInfluencerInvitation(collaborationId);
      if (!result) {
        return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, collaboration: result });
    }

    if (action === 'decline') {
      const result = updateInfluencerStatus(collaborationId, 'declined');
      if (!result) {
        return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, collaboration: result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
