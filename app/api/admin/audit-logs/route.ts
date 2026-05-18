import { NextRequest, NextResponse } from "next/server";
import { 
  getAuditLogs, 
  getAuditLogStats,
  seedAuditLogs,
  type AuditLogAction,
  type AuditLogTargetType
} from "@/lib/store";

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

    // Seed audit logs if empty (for demo purposes)
    seedAuditLogs();

    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats') === 'true';

    // Return statistics if requested
    if (stats) {
      const period = searchParams.get('period') as 'day' | 'week' | 'month' || 'month';
      const statistics = getAuditLogStats(period);
      return NextResponse.json({
        success: true,
        data: statistics
      });
    }

    // Parse filters
    const adminUserId = searchParams.get('adminUserId') || undefined;
    const action = searchParams.get('action') as AuditLogAction || undefined;
    const targetType = searchParams.get('targetType') as AuditLogTargetType || undefined;
    const startDate = searchParams.get('startDate') ? parseInt(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? parseInt(searchParams.get('endDate')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = getAuditLogs({
      adminUserId,
      action,
      targetType,
      startDate,
      endDate,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch audit logs' } },
      { status: 500 }
    );
  }
}