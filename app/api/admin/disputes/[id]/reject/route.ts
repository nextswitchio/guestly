import { NextRequest, NextResponse } from 'next/server';
import { updateDispute } from '@/lib/store';

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
    const body = await request.json();
    const { resolution } = body;

    if (!resolution) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Resolution is required' 
          } 
        },
        { status: 400 }
      );
    }

    const dispute = updateDispute(id, {
      status: 'rejected',
      resolution,
      resolutionAction: 'no_refund',
    }, adminUserId);

    if (!dispute) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Dispute not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    console.error('Error rejecting dispute:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to reject dispute' 
        } 
      },
      { status: 500 }
    );
  }
}