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

    const body = await req.json();
    const streamingConfig = {
      ...body,
      eventId,
      createdAt: Date.now()
    };
    
    // Mock saving streaming config
    return NextResponse.json({
      success: true,
      data: streamingConfig
    });
  } catch (error) {
    console.error('Error configuring streaming:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to configure streaming' },
      { status: 500 }
    );
  }
}