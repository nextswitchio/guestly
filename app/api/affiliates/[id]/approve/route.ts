import { NextRequest, NextResponse } from 'next/server';
import { getAffiliate, approveAffiliate } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = req.cookies.get('role')?.value;

    // Only platform admins can approve affiliates
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

    const approved = approveAffiliate(id);

    return NextResponse.json(approved);
  } catch (error) {
    console.error('Error approving affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to approve affiliate' },
      { status: 500 }
    );
  }
}
