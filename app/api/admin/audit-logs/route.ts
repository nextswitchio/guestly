import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      const period = searchParams.get('period') || 'month';
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/audit-logs/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        credentials: 'include',
      });
      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: { code: 'BACKEND_ERROR', message: 'Failed to fetch stats' } },
          { status: response.status }
        );
      }
      const data = await response.json();
      return NextResponse.json({ success: true, data });
    }

    const action = searchParams.get('action') || undefined;
    const adminUserId = searchParams.get('adminUserId') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const params = new URLSearchParams();
    if (action) params.append('action', action);
    if (adminUserId) params.append('user_id', adminUserId);
    params.append('page', page.toString());
    params.append('page_size', limit.toString());

    const response = await fetch(`${BACKEND_URL}/api/v1/admin/audit-logs?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: { code: 'BACKEND_ERROR', message: 'Failed to fetch audit logs' } },
        { status: response.status }
      );
    }

    const backendLogs = await response.json();

    const logs = (Array.isArray(backendLogs) ? backendLogs : []).map((log: any) => ({
      id: log.id,
      adminUserId: log.user_id,
      adminUserName: log.user_name || log.user_id,
      action: log.action?.toLowerCase().replace(/-/g, '_') || log.action,
      targetType: log.entity_type,
      targetId: log.entity_id,
      targetName: log.entity_name || log.entity_id,
      details: log.details || {},
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      timestamp: new Date(log.created_at).getTime(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total: logs.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch audit logs' } },
      { status: 500 }
    );
  }
}
