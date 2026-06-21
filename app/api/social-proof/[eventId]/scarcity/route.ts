import { NextRequest, NextResponse } from 'next/server';
import { calculateScarcityIndicator } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url);
    const ticketsRemaining = parseInt(searchParams.get('ticketsRemaining') || '0');
    const totalCapacity = parseInt(searchParams.get('totalCapacity') || '100');

    const scarcity = calculateScarcityIndicator(eventId, ticketsRemaining, totalCapacity);

    return NextResponse.json(scarcity);
  } catch (error) {
    console.error('Error calculating scarcity indicator:', error);
    return NextResponse.json(
      { error: 'Failed to calculate scarcity indicator' },
      { status: 500 }
    );
  }
}
