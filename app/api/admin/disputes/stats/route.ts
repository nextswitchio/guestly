import { NextRequest, NextResponse } from 'next/server';
import { getDisputeStats } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    // Validate token exists - backend will handle role validation via JWT
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
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