import { NextRequest, NextResponse } from "next/server";
import { updateUserLocation, checkAndCreateGeoNotifications } from "@/lib/store";

/**
 * POST /api/notifications/location
 * Update user location and trigger geo-notification check
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { latitude, longitude, city } = body;

    // Validate inputs
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !city
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Latitude, longitude, and city are required",
          },
        },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Latitude must be between -90 and 90",
          },
        },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Longitude must be between -180 and 180",
          },
        },
        { status: 400 }
      );
    }

    // Update user location
    const location = updateUserLocation(userId, latitude, longitude, city);

    // Check for nearby events and create notifications
    const result = checkAndCreateGeoNotifications();

    return NextResponse.json({
      success: true,
      data: {
        location,
        notificationsCreated: result.created,
      },
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update user location",
        },
      },
      { status: 500 }
    );
  }
}
