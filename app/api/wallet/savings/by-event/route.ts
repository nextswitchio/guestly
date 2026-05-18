import { NextRequest, NextResponse } from "next/server";
import { getSavingsTargets } from "@/lib/store";

/**
 * GET /api/wallet/savings/by-event?eventId=xxx
 * Get savings target for a specific event
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    const targets = getSavingsTargets(userId);
    const eventTarget = targets.find(t => t.eventId === eventId);

    if (!eventTarget) {
      return NextResponse.json({
        success: true,
        target: null,
      });
    }

    return NextResponse.json({
      success: true,
      target: eventTarget,
    });
  } catch (error) {
    console.error("Error fetching savings target:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
