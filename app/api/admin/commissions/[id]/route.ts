import { NextRequest, NextResponse } from 'next/server';
import { 
  updateCommissionStatus,
  eventCommissions
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
    const commission = eventCommissions[id];
    
    if (!commission) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Commission not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: commission
    });
  } catch (error) {
    console.error('Error fetching commission:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch commission' 
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
    const { status, notes, settlementReference } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Status is required' } },
        { status: 400 }
      );
    }

    const updatedCommission = updateCommissionStatus(
      id,
      status,
      notes,
      settlementReference
    );

    if (!updatedCommission) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Commission not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCommission
    });
  } catch (error) {
    console.error('Error updating commission:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to update commission' 
        } 
      },
      { status: 500 }
    );
  }
}