import { NextRequest, NextResponse } from "next/server";
import { updateNotificationPreferences, getNotificationPreferences } from "@/lib/marketing";

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Login required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { enablePromotional, enableTransactional, enableEventUpdates, enableReminders } = body;

    const preferences = updateNotificationPreferences(userId, {
      categories: {
        promotional: enablePromotional,
        transactional: enableTransactional,
        eventUpdates: enableEventUpdates,
        reminders: enableReminders,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Login required" },
        { status: 401 }
      );
    }

    const preferences = getNotificationPreferences(userId);

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}
