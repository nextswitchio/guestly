import { NextRequest, NextResponse } from "next/server";
import { getGroupWallet, addMemberToGroupWallet } from "@/lib/store";

/**
 * POST /api/wallet/groups/[id]/members
 * Add a member to a group wallet
 */
export async function POST(
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

    // Only the creator can add members
    if (groupWallet.createdBy !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the creator can add members" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId: newUserId, name, targetAmount } = body;

    // Validation
    if (!newUserId || !name || typeof targetAmount !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid member data" },
        { status: 400 }
      );
    }

    if (targetAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Target amount must be greater than 0" },
        { status: 400 }
      );
    }

    const updatedGroupWallet = addMemberToGroupWallet(
      id,
      newUserId,
      name,
      targetAmount
    );

    if (!updatedGroupWallet) {
      return NextResponse.json(
        { success: false, error: "Failed to add member" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedGroupWallet,
    });
  } catch (error) {
    console.error("Error adding member to group wallet:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add member",
      },
      { status: 500 }
    );
  }
}
