import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/events";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const eventId = id;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Mock virtual access for testing
    const access = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      userId,
      joinLink: `https://zoom.us/j/123456789?pwd=mock-${eventId}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      createdAt: Date.now()
    };
    
    return NextResponse.json({
      success: true,
      data: access
    });
  } catch (error) {
    console.error('Error getting virtual access:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get virtual access' },
      { status: 500 }
    );
  }
}

