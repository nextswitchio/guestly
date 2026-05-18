import { NextRequest, NextResponse } from 'next/server';
import { getAffiliate, suspendAffiliate } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = req.cookies.get('role')?.value;

    // Only platform admins can suspend affiliates
    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const affiliate = getAffiliate(id);

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    const suspended = suspendAffiliate(id);

    return NextResponse.json(suspended);
  } catch (error) {
    console.error('Error suspending affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to suspend affiliate' },
      { status: 500 }
    );
  }
}
