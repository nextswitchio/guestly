import { NextRequest, NextResponse } from 'next/server';
import { getAdCampaign, updateAdCampaign } from '@/lib/marketing';

export async function GET(
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

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error getting ad campaign:', error);
    return NextResponse.json(
      { error: 'Failed to get ad campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await req.json();
    const updatedCampaign = updateAdCampaign(id, body);

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error('Error updating ad campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update ad campaign' },
      { status: 500 }
    );
  }
}
