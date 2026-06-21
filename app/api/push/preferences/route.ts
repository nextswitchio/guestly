import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { enablePromotional, enableTransactional, enableEventUpdates, enableReminders } = body;
    const categories = [
      enablePromotional ? "promotional" : null,
      enableTransactional ? "transactional" : null,
      enableEventUpdates ? "eventUpdates" : null,
      enableReminders ? "reminders" : null,
    ].filter(Boolean);

    const { data, status, ok } = await fetchBackendJson(
      req,
      "/api/v1/community/notifications/preferences",
      { method: "PUT", body: JSON.stringify({ categories }) },
    );

    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
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
    const { data, status, ok } = await fetchBackendJson(req, "/api/v1/community/notifications/preferences");
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}
