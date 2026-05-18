import { NextRequest, NextResponse } from "next/server";
import { inviteVendorToEvent, createNotification, getEventOrganizer } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "organiser") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Only organizers can invite vendors" } },
        { status: 401 }
      );
    }

    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Event not found" } },
        { status: 404 }
      );
    }

    // Verify the organizer owns this event
    const organizerId = getEventOrganizer(eventId);
    if (organizerId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "You don't have permission to invite vendors to this event" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { vendorUserId } = body;

    if (!vendorUserId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "vendorUserId is required" } },
        { status: 400 }
      );
    }

    // Create the invitation
    const invitation = inviteVendorToEvent(eventId, vendorUserId);

    // Send notification to vendor
    createNotification(
      vendorUserId,
      "vendor_invitation",
      "New Event Invitation",
      `You've been invited to provide services for ${event.title}`,
      eventId
    );

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error: any) {
    console.error("Error inviting vendor:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error.message || "Failed to invite vendor" 
        } 
      },
      { status: 500 }
    );
  }
}
