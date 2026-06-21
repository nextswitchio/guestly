import { NextRequest, NextResponse } from 'next/server';
import { assignDispute } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check admin authentication
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { adminUserId } = body;

    if (!adminUserId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Admin user ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    const dispute = assignDispute(id, adminUserId);
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
    console.error('Error assigning dispute:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to assign dispute' 
        } 
      },
      { status: 500 }
    );
  }
}