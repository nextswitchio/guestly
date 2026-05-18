import { NextRequest, NextResponse } from 'next/server';
import { getDisputeStats } from '@/lib/store';

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

    const stats = getDisputeStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dispute stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch dispute statistics' 
        } 
      },
      { status: 500 }
    );
  }
}