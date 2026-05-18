import { NextRequest, NextResponse } from 'next/server';
import { getSocialProofData } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const socialProof = getSocialProofData(eventId);
    const recentPurchases = socialProof?.recentPurchases.slice(0, limit) || [];

    return NextResponse.json({ recentPurchases });
  } catch (error) {
    console.error('Error getting recent purchases:', error);
    return NextResponse.json(
      { error: 'Failed to get recent purchases' },
      { status: 500 }
    );
  }
}
