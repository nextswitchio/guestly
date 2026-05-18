import { NextRequest, NextResponse } from "next/server";
import { listEventVendors, getVendorProfile, getEventOrganizer } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;

    if (!userId || role !== "organiser") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Only organizers can view event vendors" } },
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
        { success: false, error: { code: "FORBIDDEN", message: "You don't have permission to view vendors for this event" } },
        { status: 403 }
      );
    }

    // Get all vendors for this event
    const vendors = listEventVendors(eventId);

    // Enrich with vendor profile details
    const enrichedVendors = vendors.map((vendor) => {
      const profile = getVendorProfile(vendor.vendorUserId);
      return {
        ...vendor,
        profile: profile ? {
          id: profile.id,
          name: profile.name,
          category: profile.category,
          city: profile.city,
          rating: profile.rating,
          completedEvents: profile.completedEvents,
          contactPhone: profile.contactPhone,
          contactEmail: profile.contactEmail,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedVendors,
    });
  } catch (error: any) {
    console.error("Error fetching event vendors:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error.message || "Failed to fetch event vendors" 
        } 
      },
      { status: 500 }
    );
  }
}
