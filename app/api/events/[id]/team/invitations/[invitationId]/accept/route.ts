import { NextRequest, NextResponse } from "next/server";
import { acceptTeamInvitation } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
  try {
    const { invitationId } = await params;
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const member = acceptTeamInvitation(invitationId, userId);

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Invitation not found, expired, or already accepted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Error accepting team invitation:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
