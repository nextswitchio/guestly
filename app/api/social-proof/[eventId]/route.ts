import { NextRequest, NextResponse } from 'next/server';
import { getSocialProofData } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const socialProof = getSocialProofData(eventId);

    return NextResponse.json(socialProof);
  } catch (error) {
    console.error('Error getting social proof data:', error);
    return NextResponse.json(
      { error: 'Failed to get social proof data' },
      { status: 500 }
    );
  }
}
