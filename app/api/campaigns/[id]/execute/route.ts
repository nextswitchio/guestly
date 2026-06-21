import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, executeCampaign } from '@/lib/marketing';

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

    const result = await executeCampaign(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing campaign:', error);
    return NextResponse.json(
      { error: 'Failed to execute campaign' },
      { status: 500 }
    );
  }
}
