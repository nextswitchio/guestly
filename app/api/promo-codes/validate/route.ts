import { NextRequest, NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.code || !data.eventId) {
      return NextResponse.json(
        { error: 'Missing required fields: code, eventId' },
        { status: 400 }
      );
    }

    const validation = validatePromoCode(
      data.code,
      data.eventId,
      data.ticketTypeId
    );

    // If valid, calculate discount amount for the response
    if (validation.valid && validation.promoCode) {
      const orderAmount = data.orderAmount || 0;
      let discount = 0;

      if (validation.promoCode.type === 'percentage') {
        discount = (orderAmount * validation.promoCode.value) / 100;
        if (validation.promoCode.maxDiscountAmount) {
          discount = Math.min(discount, validation.promoCode.maxDiscountAmount);
        }
      } else if (validation.promoCode.type === 'fixed') {
        discount = validation.promoCode.value;
      } else if (validation.promoCode.type === 'free') {
        discount = orderAmount;
      }

      return NextResponse.json({
        valid: true,
        discount,
        promoCode: validation.promoCode,
        message: `Promo code applied successfully!`
      });
    }

    return NextResponse.json({
      valid: false,
      message: validation.error || 'Invalid promo code',
      suggestion: validation.suggestion
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
