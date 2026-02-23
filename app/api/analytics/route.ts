import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsOverview, getEventAnalytics } from "@/features/analytics/analyticsData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  if (eventId) {
    return NextResponse.json(getEventAnalytics(eventId, { from, to }));
  }

  return NextResponse.json(getAnalyticsOverview({ from, to }));
}
