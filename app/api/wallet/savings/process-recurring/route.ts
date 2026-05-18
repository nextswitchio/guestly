import { NextRequest, NextResponse } from "next/server";
import { processDueRecurringContributions } from "@/lib/store";

// POST /api/wallet/savings/process-recurring - Process all due recurring contributions
// This endpoint should be called by a cron job or scheduled task
export async function POST(req: NextRequest) {
  try {
    // In production, you would want to add authentication here
    // to ensure only authorized services can trigger this
    
    const results = processDueRecurringContributions();
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: true,
      data: {
        processed: results.length,
        successful,
        failed,
        results,
      },
      message: `Processed ${results.length} recurring contributions (${successful} successful, ${failed} failed)`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PROCESS_ERROR",
          message: "Failed to process recurring contributions",
        },
      },
      { status: 500 }
    );
  }
}
