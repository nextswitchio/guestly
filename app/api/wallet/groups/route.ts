import { NextRequest, NextResponse } from "next/server";
import {
  createGroupWallet,
  getUserGroupWallets,
  ensureWallet,
} from "@/lib/store";

/**
 * POST /api/wallet/groups
 * Create a new group wallet
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user has a wallet
    ensureWallet(userId);

    const body = await req.json();
    const { name, eventId, members, groupType, adminUserIds, permissions } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Group name is required" },
        { status: 400 }
      );
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one member is required" },
        { status: 400 }
      );
    }

    // Validate group type
    const validGroupTypes = ['friends', 'family', 'corporate'];
    const selectedGroupType = groupType || 'friends';
    if (!validGroupTypes.includes(selectedGroupType)) {
      return NextResponse.json(
        { success: false, error: "Invalid group type" },
        { status: 400 }
      );
    }

    // Validate each member
    for (const member of members) {
      if (!member.userId || !member.name || typeof member.targetAmount !== "number") {
        return NextResponse.json(
          { success: false, error: "Invalid member data" },
          { status: 400 }
        );
      }

      if (member.targetAmount <= 0) {
        return NextResponse.json(
          { success: false, error: "Target amount must be greater than 0" },
          { status: 400 }
        );
      }
    }

    // Create the group wallet
    const groupWallet = createGroupWallet(
      userId, 
      name, 
      members, 
      eventId,
      selectedGroupType,
      adminUserIds,
      permissions
    );

    return NextResponse.json({
      success: true,
      data: groupWallet,
    });
  } catch (error) {
    console.error("Error creating group wallet:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create group wallet",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/wallet/groups
 * Get all group wallets for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const groupWallets = getUserGroupWallets(userId);

    return NextResponse.json({
      success: true,
      data: groupWallets,
    });
  } catch (error) {
    console.error("Error fetching group wallets:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch group wallets",
      },
      { status: 500 }
    );
  }
}
