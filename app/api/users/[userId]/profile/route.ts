import { NextRequest, NextResponse } from "next/server";
import {
  getUserProfile,
  createOrUpdateUserProfile,
  getUserAttendedEvents,
  getUserOrganizedEvents,
} from "@/lib/store";

/**
 * GET /api/users/[userId]/profile
 * Get user profile with attendance history
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const profile = getUserProfile(userId);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Profile not found" } },
        { status: 404 }
      );
    }

    // Get attended and organized events with details
    const attendedEvents = getUserAttendedEvents(userId);
    const organizedEvents = getUserOrganizedEvents(userId);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        attendedEvents,
        organizedEvents,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch user profile",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[userId]/profile
 * Update user profile
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const authenticatedUserId = req.cookies.get("user_id")?.value;

    // Check if user is authenticated and updating their own profile
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      displayName,
      avatar,
      bio,
      interests,
      location,
      socialLinks,
    } = body;

    // Update profile
    const profile = createOrUpdateUserProfile(userId, {
      displayName,
      avatar,
      bio,
      interests,
      location,
      socialLinks,
    });

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update user profile",
        },
      },
      { status: 500 }
    );
  }
}
