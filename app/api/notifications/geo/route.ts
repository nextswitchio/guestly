import { NextRequest, NextResponse } from "next/server";
import {
  getGeoNotifications,
  markGeoNotificationSent,
  getNearbyEventsForUser,
} from "@/lib/store";

/**
 * GET /api/notifications/geo
 * Get geo-targeted notifications for the authenticated user
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

    const { searchParams } = new URL(req.url);
    const unsentOnly = searchParams.get("unsentOnly") === "true";

    const notifications = getGeoNotifications(userId, unsentOnly);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching geo notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch geo notifications",
        },
      },
      { status: 500 }
    );
  }
}
