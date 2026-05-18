import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return empty array for now - would fetch from DB in production
    return NextResponse.json({ payouts: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Minimum payout amount is 50' }, { status: 400 });
    }

    // Would create payout request in DB in production
    return NextResponse.json({ success: true, payoutId: `payout_${Date.now()}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request payout' }, { status: 500 });
  }
}
