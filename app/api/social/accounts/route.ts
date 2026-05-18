import { NextRequest, NextResponse } from 'next/server';
import { getSocialAccounts } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    // Get organizerId from cookie or query param
    const organizerId = req.cookies.get('user_id')?.value;

    if (!organizerId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const accounts = getSocialAccounts(organizerId);

    return NextResponse.json({
      success: true,
      accounts,
    });
  } catch (error: any) {
    console.error('Get social accounts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get accounts' },
      { status: 500 }
    );
  }
}
