import { NextRequest, NextResponse } from "next/server";
import { listVendorInvitations } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "vendor") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Only vendors can view invitations" } },
        { status: 401 }
      );
    }

    // Get all invitations for this vendor
    const invitations = listVendorInvitations(userId);

    // Enrich with event details
    const enrichedInvitations = invitations.map((invitation) => {
      const event = getEventById(invitation.eventId);
      return {
        ...invitation,
        event: event ? {
          id: event.id,
          title: event.title,
          date: event.date,
          city: event.city,
          venue: event.venue,
          image: event.image,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedInvitations,
    });
  } catch (error: any) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error.message || "Failed to fetch invitations" 
        } 
      },
      { status: 500 }
    );
  }
}
