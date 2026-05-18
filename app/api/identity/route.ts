import { NextRequest, NextResponse } from 'next/server';
import { getIdentityVerification } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('user_role')?.value;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['organiser', 'vendor', 'affiliate'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const verification = getIdentityVerification(userId, role as any);

    return NextResponse.json({
      verification,
      isVerified: verification?.status === 'verified',
      isPending: verification?.status === 'pending' || verification?.status === 'under_review',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 });
  }
}
