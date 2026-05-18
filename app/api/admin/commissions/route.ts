import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCommissions, 
  getCommissionSummary,
  updateAllEventCommissions,
  generateCommissionReport
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const organizerId = searchParams.get('organizerId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const action = searchParams.get('action');

    // Handle different actions
    if (action === 'summary') {
      const summary = getCommissionSummary();
      return NextResponse.json({ success: true, data: summary });
    }

    if (action === 'update') {
      // Update all event commissions
      const updatedCommissions = updateAllEventCommissions();
      return NextResponse.json({ 
        success: true, 
        data: { 
          message: `Updated ${updatedCommissions.length} commissions`,
          commissions: updatedCommissions 
        }
      });
    }

    // Get commissions with filters
    const commissions = getAllCommissions({
      status,
      organizerId,
      dateFrom,
      dateTo,
    });

    return NextResponse.json({
      success: true,
      data: {
        commissions,
        total: commissions.length,
      }
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch commissions' 
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
    const { action, ...data } = body;

    if (action === 'generate_report') {
      const { reportType, startDate, endDate } = data;
      
      if (!reportType || !startDate || !endDate) {
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields' } },
          { status: 400 }
        );
      }

      const report = generateCommissionReport(reportType, startDate, endDate, userId);
      
      return NextResponse.json({
        success: true,
        data: report
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing commission request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to process request' 
        } 
      },
      { status: 500 }
    );
  }
}