import { NextRequest, NextResponse } from 'next/server';
import { resolveDispute, logAdminAction, getDispute } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { resolution, action, refundAmount } = body;

    if (!resolution || !action) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Resolution and action are required' 
          } 
        },
        { status: 400 }
      );
    }

    if (action === 'partial_refund' && (!refundAmount || refundAmount <= 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Refund amount is required for partial refunds' 
          } 
        },
        { status: 400 }
      );
    }

    const result = resolveDispute(
      id,
      resolution,
      action,
      refundAmount,
      adminUserId
    );

    // Log the dispute resolution
    const dispute = getDispute(id);
    if (dispute) {
      logAdminAction(
        adminUserId!,
        'Admin User', // TODO: Get actual admin name
        'dispute_resolved',
        'dispute',
        id,
        { 
          resolution, 
          action, 
          refundAmount,
          orderId: dispute.orderId,
          userId: dispute.userId 
        },
        `Dispute #${id}`,
        request
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Failed to resolve dispute'
        } 
      },
      { status: 500 }
    );
  }
}