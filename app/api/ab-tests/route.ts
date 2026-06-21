import { NextRequest, NextResponse } from 'next/server';
import { createABTest } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { campaignId, name, type, variants, trafficAllocation, confidenceLevel } = body;

    if (!campaignId || !name || !variants || !Array.isArray(variants) || variants.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields: campaignId, name, and at least 2 variants' },
        { status: 400 }
      );
    }

    const abTest = createABTest(campaignId, {
      name,
      type: type || 'email-subject',
      variants,
      trafficAllocation: trafficAllocation || variants.map(() => 100 / variants.length),
      confidenceLevel: confidenceLevel || 95,
    });

    return NextResponse.json(abTest, { status: 201 });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json(
      { error: 'Failed to create A/B test' },
      { status: 500 }
    );
  }
}
