import { NextRequest, NextResponse } from "next/server";
import { getOrganizerVendorPaymentStats } from "@/lib/store";

/**
 * GET /api/organizer/vendor-payments
 * Get vendor payment statistics for all organizer's events
 */
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Organizer authentication required" } },
      { status: 401 }
    );
  }

  try {
    const stats = getOrganizerVendorPaymentStats(userId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
