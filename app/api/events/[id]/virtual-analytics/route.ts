import { NextRequest, NextResponse } from "next/server";
import {
  getVirtualAnalytics,
  getLiveAttendeeCount,
  getActiveAttendees,
  getUserWatchTime,
} from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const userId = req.cookies.get("user_id")?.value;

  try {
    if (type === "live-count") {
      const count = getLiveAttendeeCount(eventId);
      return NextResponse.json({ success: true, data: { count } });
    }

    if (type === "active-attendees") {
      const attendees = getActiveAttendees(eventId);
      return NextResponse.json({ success: true, data: attendees });
    }

    if (type === "user-watch-time" && userId) {
      const watchTime = getUserWatchTime(eventId, userId);
      return NextResponse.json({ success: true, data: { watchTime } });
    }

    // Default: return full analytics
    const analytics = getVirtualAnalytics(eventId);
    
    if (!analytics) {
      return NextResponse.json({
        success: true,
        data: {
          eventId,
          peakAttendees: 0,
          totalUniqueViewers: 0,
          averageWatchTime: 0,
          retentionRate: 0,
          dropOffPoints: [],
          updatedAt: Date.now(),
        },
      });
    }

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
