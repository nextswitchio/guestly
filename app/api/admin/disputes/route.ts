import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllDisputes, 
  createDispute,
  type DisputeStatus,
  type DisputeReason 
} from '@/lib/store';

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
    const status = searchParams.get('status') as DisputeStatus | null;
    const reason = searchParams.get('reason') as DisputeReason | null;
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const organizerId = searchParams.get('organizerId');
    const assignedTo = searchParams.get('assignedTo');

    const filters: any = {};
    if (status) filters.status = status;
    if (reason) filters.reason = reason;
    if (userId) filters.userId = userId;
    if (organizerId) filters.organizerId = organizerId;
    if (assignedTo) filters.assignedTo = assignedTo;

    let disputes = getAllDisputes(filters);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      disputes = disputes.filter(dispute => 
        dispute.id.toLowerCase().includes(searchLower) ||
        dispute.eventTitle.toLowerCase().includes(searchLower) ||
        dispute.userName.toLowerCase().includes(searchLower) ||
        dispute.orderId.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch disputes' 
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
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, userId, reason, description } = body;

    if (!orderId || !userId || !reason || !description) {
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

    const dispute = createDispute(orderId, userId, reason, description);

    return NextResponse.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    console.error('Error creating dispute:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Failed to create dispute'
        } 
      },
      { status: 500 }
    );
  }
}