import { NextRequest, NextResponse } from "next/server";
import {
  updateTeamMemberRole,
  removeTeamMember,
  hasEventPermission,
} from "@/lib/store";
import { getEventById } from "@/lib/events";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id: eventId, userId: targetUserId } = await params;
    const currentUserId = req.cookies.get("user_id")?.value;

    if (!currentUserId) {
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
    if (!hasEventPermission(eventId, currentUserId, "canManageTeam")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role is required" },
        { status: 400 }
      );
    }

    if (!["owner", "editor", "viewer"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    const updatedMember = updateTeamMemberRole(
      eventId,
      targetUserId,
      role,
      currentUserId
    );

    if (!updatedMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id: eventId, userId: targetUserId } = await params;
    const currentUserId = req.cookies.get("user_id")?.value;

    if (!currentUserId) {
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
    if (!hasEventPermission(eventId, currentUserId, "canManageTeam")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const removed = removeTeamMember(eventId, targetUserId, currentUserId);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
