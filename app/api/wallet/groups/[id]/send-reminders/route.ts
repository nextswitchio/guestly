import { NextRequest, NextResponse } from "next/server";
import { getGroupWallet, sendContributionReminders } from "@/lib/store";

/**
 * POST /api/wallet/groups/[id]/send-reminders
 * Send contribution reminders to members who are behind
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

    // Only creator can send reminders
    if (groupWallet.createdBy !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the group creator can send reminders" },
        { status: 403 }
      );
    }

    const notifications = sendContributionReminders(id);

    return NextResponse.json({
      success: true,
      data: {
        remindersSent: notifications.length,
        notifications,
      },
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send reminders" 
      },
      { status: 500 }
    );
  }
}
