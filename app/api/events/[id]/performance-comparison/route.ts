import { NextRequest, NextResponse } from "next/server";
import { generatePerformanceComparison } from "@/lib/store";
import { getEventById } from "@/lib/events";

/**
 * GET /api/events/[id]/performance-comparison
 * Get performance comparison for an event against similar events
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    // Generate performance comparison
    const comparison = generatePerformanceComparison(eventId);
    
    if (!comparison) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_DATA",
            message: "Unable to generate performance comparison. Event may not have enough data or benchmark data may be unavailable.",
          },
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("Error generating performance comparison:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to generate performance comparison",
        },
      },
      { status: 500 }
    );
  }
}
