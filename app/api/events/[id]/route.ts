import { NextRequest, NextResponse } from "next/server";
import { getEventById, events } from "@/lib/events";

/**
 * GET /api/events/[id]
 * Fetch a single event by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = id;

  const event = getEventById(eventId);
  if (!event) {
    return NextResponse.json(
      { success: false, error: "Event not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: event
  });
}
