import { NextRequest, NextResponse } from "next/server";
import { 
  getFraudAlerts, 
  runFraudDetection, 
  getFraudDetectionStats,
  type FraudAlertType,
  type FraudAlertSeverity 
} from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = getFraudDetectionStats();
      return NextResponse.json({ success: true, data: stats });
    }

    if (action === 'run-detection') {
      const results = runFraudDetection();
      return NextResponse.json({ success: true, data: results });
    }

    // Default: get alerts with filters
    const status = searchParams.get('status') as any;
    const severity = searchParams.get('severity') as FraudAlertSeverity;
    const type = searchParams.get('type') as FraudAlertType;
    const assignedTo = searchParams.get('assignedTo') ?? undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const alerts = getFraudAlerts({
      status,
      severity,
      type,
      assignedTo,
      limit,
    });

    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error in fraud detection API:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}