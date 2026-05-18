import { NextRequest, NextResponse } from 'next/server';
import { getAdCampaign, pauseAdCampaign } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const campaign = getAdCampaign(id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Ad campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.organizerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Not your campaign' },
        { status: 403 }
      );
    }

    const pausedCampaign = pauseAdCampaign(id);

    return NextResponse.json({
      success: true,
      campaign: pausedCampaign,
    });
  } catch (error) {
    console.error('Error pausing ad campaign:', error);
    return NextResponse.json(
      { error: 'Failed to pause ad campaign' },
      { status: 500 }
    );
  }
}
