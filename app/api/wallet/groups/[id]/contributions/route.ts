import { NextRequest, NextResponse } from "next/server";
import { getGroupWallet, getGroupContributions, getGroupContributionStats } from "@/lib/store";

/**
 * GET /api/wallet/groups/[id]/contributions
 * Get contribution history for a group wallet
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const groupWallet = getGroupWallet(id);

    if (!groupWallet) {
      return NextResponse.json(
        { success: false, error: "Group wallet not found" },
        { status: 404 }
      );
    }

    // Check if user is a member or creator
    const isMember = groupWallet.members.some(m => m.userId === userId) || groupWallet.createdBy === userId;
    
    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "You are not a member of this group wallet" },
        { status: 403 }
      );
    }

    // Get contributions sorted by most recent first
    const contributions = getGroupContributions(id)
      .sort((a, b) => b.timestamp - a.timestamp);

    // Get contribution statistics
    const stats = getGroupContributionStats(id);

    return NextResponse.json({
      success: true,
      data: {
        contributions,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching group contributions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}
