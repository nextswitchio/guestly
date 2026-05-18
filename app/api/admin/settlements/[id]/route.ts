import { NextRequest, NextResponse } from 'next/server';
import { 
  getSettlement,
  updateSettlementStatus
} from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const settlement = getSettlement(id);
    
    if (!settlement) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Settlement not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: settlement
    });
  } catch (error) {
    console.error('Error fetching settlement:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch settlement' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, failureReason } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Status is required' } },
        { status: 400 }
      );
    }

    const updatedSettlement = updateSettlementStatus(
      id,
      status,
      failureReason
    );

    if (!updatedSettlement) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Settlement not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSettlement
    });
  } catch (error) {
    console.error('Error updating settlement:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to update settlement' 
        } 
      },
      { status: 500 }
    );
  }
}