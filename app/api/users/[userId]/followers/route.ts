import { NextRequest, NextResponse } from "next/server";
import { getFollowers } from "@/lib/store";

/**
 * GET /api/users/[userId]/followers
 * Get list of followers for a user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const followers = getFollowers(userId);

    return NextResponse.json({
      success: true,
      data: followers,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch followers",
        },
      },
      { status: 500 }
    );
  }
}
