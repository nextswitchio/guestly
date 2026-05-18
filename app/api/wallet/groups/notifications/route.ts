import { NextRequest, NextResponse } from "next/server";
import { 
  getGroupNotifications, 
  markAllNotificationsRead,
  getUnreadNotificationCount 
} from "@/lib/store";

/**
 * GET /api/wallet/groups/notifications
 * Get all group wallet notifications for the authenticated user
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

    const unreadOnly = req.nextUrl.searchParams.get("unreadOnly") === "true";
    const notifications = getGroupNotifications(userId, unreadOnly);
    const unreadCount = getUnreadNotificationCount(userId);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch notifications" 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet/groups/notifications/mark-read
 * Mark all notifications as read
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { groupWalletId } = body;

    const count = markAllNotificationsRead(userId, groupWalletId);

    return NextResponse.json({
      success: true,
      data: {
        markedCount: count,
      },
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to mark notifications as read" 
      },
      { status: 500 }
    );
  }
}
