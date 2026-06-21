import { NextRequest, NextResponse } from 'next/server';
import { getPromoCode, getPromoCodeStats } from '@/lib/marketing';

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

    const stats = getPromoCodeStats(id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting promo code stats:', error);
    return NextResponse.json(
      { error: 'Failed to get promo code stats' },
      { status: 500 }
    );
  }
}
