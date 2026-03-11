import { NextRequest, NextResponse } from 'next/server';
import { applyPromoCode } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.code || !data.orderId || !data.orderAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: code, orderId, orderAmount' },
        { status: 400 }
      );
    }

    const application = applyPromoCode(data.code, data.orderId, userId, data.orderAmount);

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error applying promo code:', error);
    return NextResponse.json(
      { error: 'Failed to apply promo code' },
      { status: 500 }
    );
  }
}
