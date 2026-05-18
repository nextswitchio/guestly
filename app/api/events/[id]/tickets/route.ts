import { NextRequest, NextResponse } from "next/server";
import { getAvailability, seedEventTickets } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = id;
  
  try {
    // Get the event first
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Seed tickets if they don't exist
    seedEventTickets(event);
    
    // Get ticket availability
    const availability = getAvailability(eventId);
    
    return NextResponse.json({
      success: true,
      data: availability?.tickets || []
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  const eventId = id;
  
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tickets } = body;
    
    // For now, just return success - in a real implementation, 
    // we'd need a setAvailability function
    return NextResponse.json({
      success: true,
      data: { eventId, tickets }
    });
  } catch (error) {
    console.error('Error setting tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set tickets' },
      { status: 500 }
    );
  }
}