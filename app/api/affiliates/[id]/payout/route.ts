import { NextRequest, NextResponse } from 'next/server';
import { getAffiliate, createPayoutRequest } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const affiliate = getAffiliate(id);

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    // Only the affiliate owner can create payout requests
    if (affiliate.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this affiliate account.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const payoutRequest = createPayoutRequest(id, amount);

    return NextResponse.json(payoutRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating payout request:', error);
    return NextResponse.json(
      { error: 'Failed to create payout request' },
      { status: 500 }
    );
  }
}
