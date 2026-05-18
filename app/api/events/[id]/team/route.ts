import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, hasEventPermission, getUserProfile } from "@/lib/store";
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
    if (!hasEventPermission(eventId, userId, "canViewAnalytics")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const members = getTeamMembers(eventId);

    // Enrich members with user profile data
    const enrichedMembers = members.map((member) => {
      const profile = getUserProfile(member.userId);
      return {
        ...member,
        displayName: profile?.displayName || "Unknown User",
        avatar: profile?.avatar,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedMembers,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
