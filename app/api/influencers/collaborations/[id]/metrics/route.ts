import { NextRequest, NextResponse } from 'next/server';
import { getInfluencerCollaboration } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const collaboration = getInfluencerCollaboration(id);

    if (!collaboration) {
      return NextResponse.json(
        { error: 'Collaboration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(collaboration.metrics);
  } catch (error) {
    console.error('Error getting collaboration metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get collaboration metrics' },
      { status: 500 }
    );
  }
}
