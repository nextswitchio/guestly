import { NextRequest, NextResponse } from 'next/server';
import { getAdCampaign, syncAdMetrics } from '@/lib/marketing';

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

    const metrics = await syncAdMetrics(id);

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Error syncing ad metrics:', error);
    return NextResponse.json(
      { error: 'Failed to sync ad metrics' },
      { status: 500 }
    );
  }
}
