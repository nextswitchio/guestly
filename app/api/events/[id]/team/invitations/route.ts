import { NextRequest, NextResponse } from "next/server";
import { getTeamInvitations, hasEventPermission } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view team
    if (!hasEventPermission(eventId, userId, "canManageTeam")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;

    const invitations = getTeamInvitations(eventId, status);

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("Error fetching team invitations:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
