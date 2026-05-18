import { NextRequest, NextResponse } from "next/server";
import { recordEventCompletion, getEventOrganizer } from "@/lib/store";
import { getEventById } from "@/lib/events";

function userId(req: NextRequest) {
  return req.cookies.get("user_id")?.value || "";
}

/**
 * POST /api/events/[id]/complete
 * Mark an event as completed and record it in organizer history
 * This should be called when an event finishes
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const organizerId = userId(req);
    
    if (!organizerId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    // Verify the user is the organizer of this event
    const eventOrganizerId = getEventOrganizer(eventId);
    if (eventOrganizerId !== organizerId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: "FORBIDDEN", 
            message: "You are not the organizer of this event" 
          } 
        },
        { status: 403 }
      );
    }
    
    // Record event completion
    const historyRecord = recordEventCompletion(eventId);
    
    if (!historyRecord) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to record event completion",
          },
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: historyRecord,
    });
  } catch (error) {
    console.error("Error completing event:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to complete event",
        },
      },
      { status: 500 }
    );
  }
}
