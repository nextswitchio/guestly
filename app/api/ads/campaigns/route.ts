import { NextRequest, NextResponse } from 'next/server';
import { createAdCampaign, listAdCampaigns } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { platform, eventId, name, budget, targeting, creatives } = body;

    if (!platform || !eventId || !name || !budget) {
      return NextResponse.json(
        { error: 'Platform, eventId, name, and budget are required' },
        { status: 400 }
      );
    }

    const campaign = createAdCampaign(userId, {
      eventId,
      platform,
      name,
      budget,
      targeting,
      creatives,
      objective: body.objective || 'conversions',
      status: 'draft',
      startDate: body.startDate || Date.now(),
      endDate: body.endDate,
    });

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error('Error creating ad campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create ad campaign' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    let campaigns = listAdCampaigns(userId);

    // Apply filters
    if (eventId) {
      campaigns = campaigns.filter(c => c.eventId === eventId);
    }
    if (platform) {
      campaigns = campaigns.filter(c => c.platform === platform);
    }
    if (status) {
      campaigns = campaigns.filter(c => c.status === status);
    }

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error('Error listing ad campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to list ad campaigns' },
      { status: 500 }
    );
  }
}
