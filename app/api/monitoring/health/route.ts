import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const period = searchParams.get('period') || '24h';
    
    // Fetch comprehensive monitoring data from all endpoints
    const [healthRes, performanceRes, revenueRes, activityRes, performersRes, anomaliesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/monitoring/health`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
      fetch(`${BACKEND_URL}/api/v1/monitoring/performance?period=${period}`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
      fetch(`${BACKEND_URL}/api/v1/monitoring/revenue/analytics?period=30d&group_by=transaction_type`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
      fetch(`${BACKEND_URL}/api/v1/monitoring/activity?period=${period}`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
      fetch(`${BACKEND_URL}/api/v1/monitoring/revenue/top-performers?limit=10&metric=revenue`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
      fetch(`${BACKEND_URL}/api/v1/monitoring/anomalies`, {
        headers: getAuthHeaders(req),
        credentials: 'include',
        cache: 'no-store',
      }),
    ]);
    
    const healthData = await healthRes.json().catch(() => ({}));
    const performanceData = await performanceRes.json().catch(() => ({}));
    const revenueData = await revenueRes.json().catch(() => ({}));
    const activityData = await activityRes.json().catch(() => ({}));
    const performersData = await performersRes.json().catch(() => ({}));
    const anomaliesData = await anomaliesRes.json().catch((err) => { console.error("Failed to parse anomalies data:", err); return []; });
    
    // Generate comprehensive report
    const report = {
      generated_at: new Date().toISOString(),
      period,
      health: healthData,
      performance: performanceData,
      revenue: revenueData,
      activity: activityData,
      top_performers: performersData,
      anomalies: anomaliesData,
      summary: {
        status: healthData.status || 'unknown',
        total_revenue: revenueData.total_revenue || 0,
        total_transactions: revenueData.total_transactions || 0,
        active_users: activityData.active_users || 0,
        new_users: activityData.new_users || 0,
        anomaly_count: Array.isArray(anomaliesData) ? anomaliesData.length : 0,
      },
    };
    
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return NextResponse.json({ error: 'Failed to fetch monitoring data' }, { status: 502 });
  }
}
