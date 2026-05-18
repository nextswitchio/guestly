import { NextRequest, NextResponse } from "next/server";
import { getFollowing } from "@/lib/store";

/**
 * GET /api/users/[userId]/following
 * Get list of users that this user is following
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const following = getFollowing(userId);

    return NextResponse.json({
      success: true,
      data: following,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch following",
        },
      },
      { status: 500 }
    );
  }
}
