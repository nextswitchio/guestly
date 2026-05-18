import { NextRequest, NextResponse } from 'next/server';
import { listInfluencerCollaborations } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const collaborations = listInfluencerCollaborations(userId);

    return NextResponse.json({ collaborations });
  } catch (error) {
    console.error('Error listing collaborations:', error);
    return NextResponse.json(
      { error: 'Failed to list collaborations' },
      { status: 500 }
    );
  }
}
