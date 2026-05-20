import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ following: false }, { status: 401 });

  const organizerId = req.nextUrl.searchParams.get("organizerId");
  if (!organizerId) return NextResponse.json({ error: "organizerId required" }, { status: 400 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/community/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return NextResponse.json({ following: false });

    const following = await res.json();
    const isFollowing = following.some((f: { following_id: string }) => f.following_id === organizerId);
    return NextResponse.json({ following: isFollowing });
  } catch {
    return NextResponse.json({ following: false });
  }
}
