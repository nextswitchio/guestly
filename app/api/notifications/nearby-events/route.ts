import { NextRequest, NextResponse } from "next/server";
import { getNearbyEventsForUser } from "@/lib/store";

/**
 * GET /api/notifications/nearby-events
 * Get nearby events for the authenticated user based on their location and preferences
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const nearbyEvents = getNearbyEventsForUser(userId);

    return NextResponse.json({
      success: true,
      data: nearbyEvents,
    });
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch nearby events",
        },
      },
      { status: 500 }
    );
  }
}
