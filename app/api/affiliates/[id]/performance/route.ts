import { NextRequest, NextResponse } from 'next/server';
import { getAffiliate, getAffiliatePerformance } from '@/lib/marketing';

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

    // Only the affiliate owner or admin can view performance
    if (affiliate.userId !== userId && role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. You do not have access to this affiliate.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') 
      ? parseInt(searchParams.get('startDate')!) 
      : Date.now() - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const endDate = searchParams.get('endDate') 
      ? parseInt(searchParams.get('endDate')!) 
      : Date.now();

    const performance = getAffiliatePerformance(id);

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error getting affiliate performance:', error);
    return NextResponse.json(
      { error: 'Failed to get affiliate performance' },
      { status: 500 }
    );
  }
}
