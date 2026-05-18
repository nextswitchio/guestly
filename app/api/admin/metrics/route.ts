import { NextRequest, NextResponse } from 'next/server';
import { 
  getPlatformMetrics, 
  getPlatformGrowthData, 
  getTopPerformingEvents,
  getRevenueByCategory,
  getActiveUsersCount 
} from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (simplified check)
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'day' | 'week' | 'month' | 'year') || 'month';

    // Get platform metrics
    const metrics = getPlatformMetrics(period);
    
    // Get growth data for charts
    const growthData = getPlatformGrowthData(period);
    
    // Get top performing events
    const topEvents = getTopPerformingEvents(5);
    
    // Get revenue by category
    const categoryRevenue = getRevenueByCategory();
    
    // Get active users count
    const activeUsers = getActiveUsersCount();

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          ...metrics,
          activeUsers,
        },
        growthData,
        topEvents,
        categoryRevenue,
      }
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch platform metrics' 
        } 
      },
      { status: 500 }
    );
  }
}