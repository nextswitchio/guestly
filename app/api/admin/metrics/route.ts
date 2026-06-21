import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

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

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'day' | 'week' | 'month' | 'year') || 'month';

    const response = await fetch(`${BACKEND_URL}/api/v1/admin/analytics?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const analytics = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(analytics, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalEvents: analytics.overview?.totalEvents ?? 0,
          totalUsers: analytics.overview?.totalUsers ?? 0,
          totalRevenue: analytics.overview?.totalRevenue ?? 0,
          totalCommission: analytics.overview?.totalCommission ?? 0,
          activeUsers: analytics.overview?.activeUsers ?? 0,
          activeOrganizers: analytics.overview?.organizers ?? 0,
          activeVendors: analytics.overview?.vendors ?? 0,
          growthTrends: analytics.growth ?? {},
        },
        growthData: (analytics.trends?.revenue ?? []).map((point: { label: string; value: number }, index: number) => ({
          label: point.label,
          revenue: point.value,
          users: analytics.trends?.users?.[index]?.value ?? 0,
          events: analytics.trends?.events?.[index]?.value ?? 0,
        })),
        topEvents: analytics.reports?.topEvents ?? [],
        categoryRevenue: (analytics.reports?.categoryPerformance ?? []).map((item: { category: string; revenue: number }) => ({
          category: item.category,
          revenue: item.revenue,
        })),
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
