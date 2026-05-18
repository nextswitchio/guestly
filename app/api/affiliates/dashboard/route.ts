import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateByUserId, getAffiliatePerformance } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const affiliate = getAffiliateByUserId(userId);

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate account not found. Please register as an affiliate first.' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') 
      ? parseInt(searchParams.get('startDate')!) 
      : Date.now() - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const endDate = searchParams.get('endDate') 
      ? parseInt(searchParams.get('endDate')!) 
      : Date.now();

    const performance = getAffiliatePerformance(affiliate.id);

    const dashboard = {
      affiliate,
      performance,
      summary: {
        totalEarnings: affiliate.totalEarnings,
        pendingEarnings: affiliate.pendingEarnings,
        paidEarnings: affiliate.paidEarnings,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
      },
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error getting affiliate dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to get affiliate dashboard' },
      { status: 500 }
    );
  }
}
