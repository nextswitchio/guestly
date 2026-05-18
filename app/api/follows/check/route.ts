import { NextRequest, NextResponse } from "next/server";
import { isFollowing } from "@/lib/store";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const organizerId = req.nextUrl.searchParams.get("organizerId");
  if (!organizerId) return NextResponse.json({ success: false, error: "organizerId required" }, { status: 400 });

  return NextResponse.json({ success: true, following: isFollowing(userId, organizerId) });
}
