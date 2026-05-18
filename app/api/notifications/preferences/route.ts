import { NextRequest, NextResponse } from "next/server";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/store";

/**
 * GET /api/notifications/preferences
 * Get notification preferences for the authenticated user
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

    const preferences = getNotificationPreferences(userId);

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch notification preferences",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences for the authenticated user
 */
export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      geoNotificationsEnabled,
      notificationRadius,
      categories,
      minPrice,
      maxPrice,
    } = body;

    // Validate inputs
    if (notificationRadius !== undefined && (notificationRadius < 1 || notificationRadius > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Notification radius must be between 1 and 100 km",
          },
        },
        { status: 400 }
      );
    }

    if (categories !== undefined && !Array.isArray(categories)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Categories must be an array",
          },
        },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (geoNotificationsEnabled !== undefined) updates.geoNotificationsEnabled = geoNotificationsEnabled;
    if (notificationRadius !== undefined) updates.notificationRadius = notificationRadius;
    if (categories !== undefined) updates.categories = categories;
    if (minPrice !== undefined) updates.minPrice = minPrice;
    if (maxPrice !== undefined) updates.maxPrice = maxPrice;

    const preferences = updateNotificationPreferences(userId, updates);

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update notification preferences",
        },
      },
      { status: 500 }
    );
  }
}
