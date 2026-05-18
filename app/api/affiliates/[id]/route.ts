import { NextRequest, NextResponse } from 'next/server';
import { getAffiliate } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

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

    // Only the affiliate owner or admin can view details
    if (affiliate.userId !== userId && role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. You do not have access to this affiliate.' },
        { status: 403 }
      );
    }

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error getting affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to get affiliate' },
      { status: 500 }
    );
  }
}
