import { NextRequest, NextResponse } from "next/server";
import { followUser, unfollowUser, getFollowing } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const following = getFollowing(userId);
  return NextResponse.json({ success: true, data: following });
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { organizerId, action } = await req.json();
  if (!organizerId) return NextResponse.json({ success: false, error: "organizerId required" }, { status: 400 });

  if (action === "unfollow") {
    unfollowUser(userId, organizerId);
    return NextResponse.json({ success: true, following: false });
  }

  followUser(userId, organizerId, "organizer");
  return NextResponse.json({ success: true, following: true });
}
