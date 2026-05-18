import { NextRequest, NextResponse } from "next/server";
import { markGeoNotificationSent } from "@/lib/store";

/**
 * PATCH /api/notifications/geo/[id]
 * Mark a geo notification as sent
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const notificationId = id;
    const success = markGeoNotificationSent(notificationId, userId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Notification not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { notificationId, sent: true },
    });
  } catch (error) {
    console.error("Error marking notification as sent:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to mark notification as sent",
        },
      },
      { status: 500 }
    );
  }
}
