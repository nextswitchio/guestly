import { NextRequest, NextResponse } from 'next/server';
import { listInfluencerCollaborations } from '@/lib/marketing';

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
