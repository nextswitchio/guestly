import { NextRequest, NextResponse } from 'next/server';
import { sendEmailCampaign, getEmailCampaign } from '@/lib/marketing';

// POST /api/email/campaigns/[id]/send - Send email campaign
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const campaign = getEmailCampaign(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Email campaign not found' },
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

    const body = await req.json();
    const { segmentId } = body;

    const result = await sendEmailCampaign(campaignId, segmentId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error sending email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send email campaign' },
      { status: 500 }
    );
  }
}
