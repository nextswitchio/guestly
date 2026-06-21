import { NextRequest, NextResponse } from 'next/server';
import { getEmailMetrics, getEmailCampaign } from '@/lib/marketing';

// GET /api/email/campaigns/[id]/metrics - Get email campaign metrics
export async function GET(
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

    const metrics = getEmailMetrics(campaignId);

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error('Error fetching email metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email metrics' },
      { status: 500 }
    );
  }
}
