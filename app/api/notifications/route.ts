import { NextRequest, NextResponse } from "next/server";
import { getNotifications, markAllUserNotificationsRead } from "@/lib/store";

/**
 * GET /api/notifications
 * Get notifications for authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const notifications = getNotifications(userId, unreadOnly);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch notifications",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark all notifications as read
 */
export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const count = markAllUserNotificationsRead(userId);

    return NextResponse.json({
      success: true,
      data: { markedCount: count },
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to mark notifications as read",
        },
      },
      { status: 500 }
    );
  }
}
