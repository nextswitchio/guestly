import { NextRequest, NextResponse } from "next/server";
import {
  getGroupWallet,
  isGroupWalletAdmin,
  addGroupWalletAdmin,
  removeGroupWalletAdmin,
  approveMember,
  rejectMember,
  removeMemberFromGroup,
  setMemberTargetByAdmin,
  completeGroupWalletEarly,
  updateGroupPermissions,
} from "@/lib/store";

/**
 * POST /api/wallet/groups/[id]/admin
 * Perform admin actions on a group wallet
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
    const groupWalletId = id;
    const groupWallet = getGroupWallet(groupWalletId);

    if (!groupWallet) {
      return NextResponse.json(
        { success: false, error: "Group wallet not found" },
        { status: 404 }
      );
    }

    // Check if user is an admin
    if (!isGroupWalletAdmin(groupWalletId, userId)) {
      return NextResponse.json(
        { success: false, error: "Only admins can perform this action" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, targetUserId, targetAmount, permissions, newAdminUserId } = body;

    let result;

    switch (action) {
      case "approve_member":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "targetUserId is required" },
            { status: 400 }
          );
        }
        result = approveMember(groupWalletId, userId, targetUserId);
        break;

      case "reject_member":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "targetUserId is required" },
            { status: 400 }
          );
        }
        result = rejectMember(groupWalletId, userId, targetUserId);
        break;

      case "remove_member":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "targetUserId is required" },
            { status: 400 }
          );
        }
        result = removeMemberFromGroup(groupWalletId, userId, targetUserId);
        break;

      case "set_member_target":
        if (!targetUserId || typeof targetAmount !== "number") {
          return NextResponse.json(
            { success: false, error: "targetUserId and targetAmount are required" },
            { status: 400 }
          );
        }
        result = setMemberTargetByAdmin(groupWalletId, userId, targetUserId, targetAmount);
        break;

      case "complete_early":
        result = completeGroupWalletEarly(groupWalletId, userId);
        break;

      case "update_permissions":
        if (!permissions) {
          return NextResponse.json(
            { success: false, error: "permissions object is required" },
            { status: 400 }
          );
        }
        result = updateGroupPermissions(groupWalletId, userId, permissions);
        break;

      case "add_admin":
        if (!newAdminUserId) {
          return NextResponse.json(
            { success: false, error: "newAdminUserId is required" },
            { status: 400 }
          );
        }
        result = addGroupWalletAdmin(groupWalletId, userId, newAdminUserId);
        break;

      case "remove_admin":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "targetUserId is required" },
            { status: 400 }
          );
        }
        result = removeGroupWalletAdmin(groupWalletId, userId, targetUserId);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error performing admin action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to perform admin action",
      },
      { status: 500 }
    );
  }
}
