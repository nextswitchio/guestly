import { NextRequest, NextResponse } from "next/server";
import { getGroupWallet } from "@/lib/store";

/**
 * GET /api/wallet/groups/[id]
 * Get a specific group wallet by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const groupWallet = getGroupWallet(id);

    if (!groupWallet) {
      return NextResponse.json(
        { success: false, error: "Group wallet not found" },
        { status: 404 }
      );
    }

    // Check if user is a member or creator
    const isMember =
      groupWallet.createdBy === userId ||
      groupWallet.members.some((m) => m.userId === userId);

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: groupWallet,
    });
  } catch (error) {
    console.error("Error fetching group wallet:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch group wallet",
      },
      { status: 500 }
    );
  }
}
