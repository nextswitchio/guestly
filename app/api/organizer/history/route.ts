import { NextRequest, NextResponse } from "next/server";
import { 
  getOrganizerHistory, 
  getOrganizerPerformancePattern,
  getOrganizerEvents 
} from "@/lib/store";

function userId(req: NextRequest) {
  return req.cookies.get("user_id")?.value || "";
}

/**
 * GET /api/organizer/history
 * Get organizer's event history and performance pattern
 */
export async function GET(req: NextRequest) {
  try {
    const organizerId = userId(req);
    
    if (!organizerId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    
    // Get organizer's event history
    const history = getOrganizerHistory(organizerId);
    
    // Get performance pattern
    const pattern = getOrganizerPerformancePattern(organizerId);
    
    // Get all event IDs for this organizer
    const eventIds = getOrganizerEvents(organizerId);
    
    return NextResponse.json({
      success: true,
      data: {
        history,
        pattern,
        eventIds,
      },
    });
  } catch (error) {
    console.error("Error fetching organizer history:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch organizer history",
        },
      },
      { status: 500 }
    );
  }
}
