import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    let endpoint = `${BACKEND_URL}/api/v1/virtual/events/${eventId}/analytics`;
    if (type === "live-count") endpoint += "?type=live-count";
    else if (type === "active-attendees") endpoint += "?type=active-attendees";

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch analytics" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        peakAttendees: 0,
        totalUniqueViewers: 0,
        averageWatchTime: 0,
        retentionRate: 0,
        dropOffPoints: [],
      },
    });
  }
}
