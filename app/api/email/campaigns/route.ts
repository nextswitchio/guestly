import { NextRequest, NextResponse } from 'next/server';
import { createEmailCampaign } from '@/lib/marketing';

// POST /api/email/campaigns - Create email campaign
export async function POST(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.templateId || !data.eventId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, templateId, eventId' },
        { status: 400 }
      );
    }

    const campaign = createEmailCampaign(organizerId, data);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create email campaign' },
      { status: 500 }
    );
  }
}
