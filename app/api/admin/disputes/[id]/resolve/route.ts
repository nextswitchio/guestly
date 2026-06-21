import { NextRequest, NextResponse } from 'next/server';
import { resolveDispute, logAdminAction, getDispute } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate token exists - backend will handle role validation via JWT
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const adminUserId = request.cookies.get('user_id')?.value;
    const adminName = request.cookies.get('admin_name')?.value || 'Admin User';
    if (!adminUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin user ID required' } },
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
        adminUserId,
        adminName,
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
