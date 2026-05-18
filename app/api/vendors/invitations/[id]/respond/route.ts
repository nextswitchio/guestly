import { NextRequest, NextResponse } from "next/server";
import { updateVendorInviteStatus, createNotification, getEventOrganizer } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "vendor") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Only vendors can respond to invitations" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["accepted", "declined"].includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "status must be 'accepted' or 'declined'" } },
        { status: 400 }
      );
    }

    // Update the invitation status
    const invitation = updateVendorInviteStatus(eventId, userId, status);

    // Get event details for notification
    const event = getEventById(eventId);
    if (event) {
      const organizerId = getEventOrganizer(eventId);
      if (organizerId) {
        // Notify the organizer
        createNotification(
          organizerId,
          "vendor_response",
          `Vendor ${status === "accepted" ? "Accepted" : "Declined"} Invitation`,
          `A vendor has ${status} your invitation for ${event.title}`,
          eventId
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error.message || "Failed to respond to invitation" 
        } 
      },
      { status: 500 }
    );
  }
}
