import { NextRequest, NextResponse } from "next/server";
import { getEventMetrics, updateEventMetrics } from "@/lib/store";
import { getEventById } from "@/lib/events";

/**
 * GET /api/events/[id]/metrics
 * Get performance metrics for an event
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    // Get metrics for the event
    const metrics = getEventMetrics(eventId);
    
    // If no metrics exist yet, return default metrics
    if (!metrics) {
      return NextResponse.json({
        success: true,
        data: {
          eventId,
          views: 0,
          saves: 0,
          ticketsSold: 0,
          revenue: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          refundRate: 0,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching event metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch event metrics",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/events/[id]/metrics
 * Update event metrics (admin/system function)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;
    
    // Verify event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    
    // Update metrics
    const metrics = updateEventMetrics(eventId, body);
    
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error updating event metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update event metrics",
        },
      },
      { status: 500 }
    );
  }
}
