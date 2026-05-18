import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/events";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  const eventId = id;
  
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Mock publishing the event (change status from draft to published)
    const publishedEvent = {
      ...event,
      status: 'published',
      publishedAt: Date.now()
    };
    
    return NextResponse.json({
      success: true,
      data: publishedEvent
    });
  } catch (error) {
    console.error('Error publishing event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish event' },
      { status: 500 }
    );
  }
}