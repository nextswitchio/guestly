import { NextRequest, NextResponse } from "next/server";
import { createTeamInvitation, hasEventPermission } from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function POST(
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

    // Check if user has permission to manage team
    if (!hasEventPermission(eventId, userId, "canManageTeam")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { success: false, error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!["owner", "editor", "viewer"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    const invitation = createTeamInvitation(eventId, email, role, userId);

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("Error creating team invitation:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
