import { NextRequest, NextResponse } from 'next/server';
import { getAllRefunds, processRefund } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const userId = searchParams.get('userId');
    const processedBy = searchParams.get('processedBy');

    const filters: any = {};
    if (status) filters.status = status;
    if (userId) filters.userId = userId;
    if (processedBy) filters.processedBy = processedBy;

    const refunds = getAllRefunds(filters);

    return NextResponse.json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch refunds' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const role = request.cookies.get('role')?.value;
    const adminUserId = request.cookies.get('user_id')?.value;
    
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, userId, amount, reason } = body;

    if (!orderId || !userId || !amount || !reason) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Missing required fields' 
          } 
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Refund amount must be greater than 0' 
          } 
        },
        { status: 400 }
      );
    }

    const refund = processRefund(
      orderId,
      userId,
      amount,
      reason,
      adminUserId || 'system'
    );

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Failed to process refund'
        } 
      },
      { status: 500 }
    );
  }
}