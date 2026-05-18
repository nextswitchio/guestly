import { NextRequest, NextResponse } from "next/server";
import { followUser, unfollowUser, isFollowing } from "@/lib/store";

/**
 * POST /api/users/[userId]/follow
 * Follow a user or organizer
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    const followerId = req.cookies.get("user_id")?.value;

    if (!followerId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    // Can't follow yourself
    if (followerId === followingId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "Cannot follow yourself" },
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { type = "user" } = body;

    const follow = followUser(followerId, followingId, type);

    return NextResponse.json({
      success: true,
      data: follow,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to follow user",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[userId]/follow
 * Unfollow a user or organizer
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    const followerId = req.cookies.get("user_id")?.value;

    if (!followerId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const success = unfollowUser(followerId, followingId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Follow relationship not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Unfollowed successfully" },
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to unfollow user",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/[userId]/follow
 * Check if authenticated user is following this user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    const followerId = req.cookies.get("user_id")?.value;

    if (!followerId) {
      return NextResponse.json({
        success: true,
        data: { isFollowing: false },
      });
    }

    const following = isFollowing(followerId, followingId);

    return NextResponse.json({
      success: true,
      data: { isFollowing: following },
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to check follow status",
        },
      },
      { status: 500 }
    );
  }
}
