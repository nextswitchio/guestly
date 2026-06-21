import { NextRequest, NextResponse } from 'next/server';
import { getPromoCode, deactivatePromoCode } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const promoCode = getPromoCode(id);

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (promoCode.organizerId !== organizerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this promo code.' },
        { status: 403 }
      );
    }

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error('Error getting promo code:', error);
    return NextResponse.json(
      { error: 'Failed to get promo code' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const promoCode = getPromoCode(id);

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Promo code not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (promoCode.organizerId !== organizerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this promo code.' },
        { status: 403 }
      );
    }

    const deactivated = deactivatePromoCode(id);

    return NextResponse.json(deactivated);
  } catch (error) {
    console.error('Error deactivating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate promo code' },
      { status: 500 }
    );
  }
}
