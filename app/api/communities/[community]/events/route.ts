import { NextRequest, NextResponse } from "next/server";
import { getEventsByCommunity } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ community: string }> }
) {
  try {
    const { community: communityParam } = await params;
    const community = decodeURIComponent(communityParam);
    const events = getEventsByCommunity(community);
    
    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching community events:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_COMMUNITY_EVENTS_ERROR",
          message: "Failed to fetch community events",
        },
      },
      { status: 500 }
    );
  }
}
