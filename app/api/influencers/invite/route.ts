import { NextRequest, NextResponse } from 'next/server';
import { inviteInfluencer } from '@/lib/marketing';

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
    const { 
      influencerId, 
      eventId, 
      influencerName,
      influencerPlatform,
      influencerHandle,
      audienceSize,
      engagementRate,
      compensationType, 
      compensationAmount,
      commissionRate,
      freeTicketCount,
      deliverables,
      trackingCode,
      promoCode
    } = body;

    if (!influencerId || !eventId || !influencerName || !compensationType) {
      return NextResponse.json(
        { error: 'Missing required fields: influencerId, eventId, influencerName, compensationType' },
        { status: 400 }
      );
    }

    const invitation = inviteInfluencer(organizerId, {
      influencerId,
      eventId,
      influencerName,
      influencerPlatform: influencerPlatform || 'instagram',
      influencerHandle: influencerHandle || '',
      audienceSize: audienceSize || 0,
      engagementRate: engagementRate || 0,
      compensationType,
      compensationAmount,
      commissionRate,
      freeTicketCount,
      deliverables: deliverables || [],
      trackingCode: trackingCode || `INF-${Date.now()}`,
      promoCode,
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Error inviting influencer:', error);
    return NextResponse.json(
      { error: 'Failed to invite influencer' },
      { status: 500 }
    );
  }
}
