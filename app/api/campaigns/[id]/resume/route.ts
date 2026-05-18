import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, resumeCampaign } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const campaign = getCampaign(id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (campaign.organizerId !== organizerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this campaign.' },
        { status: 403 }
      );
    }

    const resumedCampaign = resumeCampaign(id);

    return NextResponse.json(resumedCampaign);
  } catch (error) {
    console.error('Error resuming campaign:', error);
    return NextResponse.json(
      { error: 'Failed to resume campaign' },
      { status: 500 }
    );
  }
}
