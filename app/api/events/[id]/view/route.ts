import { NextRequest, NextResponse } from "next/server";
import { incrementEventViews, clearCityStatsCache } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Increment view count
    incrementEventViews(id);
    
    // Clear city cache to update trending events
    const event = getEventById(id);
    if (event) {
      clearCityStatsCache(event.city);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking event view:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TRACKING_ERROR",
          message: "Failed to track event view",
        },
      },
      { status: 500 }
    );
  }
}
