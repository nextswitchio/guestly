import { NextRequest, NextResponse } from 'next/server';
import { createPromoCode, listPromoCodes } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.eventId || !data.code || !data.type || data.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, code, type, value' },
        { status: 400 }
      );
    }

    const promoCode = createPromoCode(organizerId, data);

    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to create promo code' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;

    const promoCodes = listPromoCodes(organizerId, eventId);

    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error('Error listing promo codes:', error);
    return NextResponse.json(
      { error: 'Failed to list promo codes' },
      { status: 500 }
    );
  }
}
