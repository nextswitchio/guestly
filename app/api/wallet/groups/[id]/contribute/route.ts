import { NextRequest, NextResponse } from "next/server";
import { getGroupWallet, contributeToGroupWallet } from "@/lib/store";

/**
 * POST /api/wallet/groups/[id]/contribute
 * Contribute to a group wallet
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

    // Check if user is a member
    const isMember = groupWallet.members.some((m) => m.userId === userId);
    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "You are not a member of this group wallet" },
        { status: 403 }
      );
    }

    // Check if group wallet is active
    if (groupWallet.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Group wallet is not active" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { amount } = body;

    // Validation
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid contribution amount" },
        { status: 400 }
      );
    }

    const updatedGroupWallet = contributeToGroupWallet(id, userId, amount);

    if (!updatedGroupWallet) {
      return NextResponse.json(
        { success: false, error: "Failed to contribute" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedGroupWallet,
    });
  } catch (error) {
    console.error("Error contributing to group wallet:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to contribute",
      },
      { status: 500 }
    );
  }
}
