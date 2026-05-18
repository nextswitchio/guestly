import { NextRequest, NextResponse } from 'next/server';
import { 
  createCommissionSettlement,
  getAllSettlements,
  updateSettlementStatus
} from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const settlements = getAllSettlements();

    return NextResponse.json({
      success: true,
      data: settlements
    });
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch settlements' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    const userId = request.cookies.get('user_id')?.value;
    
    if (role !== 'admin' || !userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { commissionIds, settlementMethod, settlementDetails } = body;

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Commission IDs are required' } },
        { status: 400 }
      );
    }

    if (!settlementMethod) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Settlement method is required' } },
        { status: 400 }
      );
    }

    const settlement = createCommissionSettlement(
      commissionIds,
      settlementMethod,
      settlementDetails || {},
      userId
    );

    return NextResponse.json({
      success: true,
      data: settlement
    });
  } catch (error) {
    console.error('Error creating settlement:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Failed to create settlement'
        } 
      },
      { status: 500 }
    );
  }
}