import { NextRequest, NextResponse } from 'next/server';
import { createCampaign, listCampaigns } from '@/lib/marketing';

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
    if (!data.name || !data.type || !data.channels) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, channels' },
        { status: 400 }
      );
    }

    const campaign = createCampaign(organizerId, data);

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const campaigns = listCampaigns(organizerId, {
      eventId,
      status: status as any,
      type: type as any,
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error listing campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to list campaigns' },
      { status: 500 }
    );
  }
}
