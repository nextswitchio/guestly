import { NextRequest, NextResponse } from "next/server";
import { markUserNotificationRead, deleteNotification } from "@/lib/store";

/**
 * PUT /api/notifications/[id]
 * Mark a notification as read
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: notificationId } = await params;
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

    const success = markUserNotificationRead(notificationId, userId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Notification not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Notification marked as read" },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to mark notification as read",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: notificationId } = await params;
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

    const success = deleteNotification(notificationId, userId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Notification not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Notification deleted" },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete notification",
        },
      },
      { status: 500 }
    );
  }
}
