import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizerId: string }> }
) {
  try {
    const { organizerId } = await params;
    const token = req.cookies.get("access_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/users/${organizerId}`, { headers });

    if (!res.ok) {
      return NextResponse.json({
        id: organizerId,
        display_name: null,
        email: null,
        avatar: null,
        bio: null,
        is_verified: false,
        followerCount: 0,
        totalEvents: 0,
        totalAttendees: 0,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      id: data.id,
      display_name: data.display_name,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio,
      is_verified: data.is_verified ?? false,
      followerCount: 0,
      totalEvents: 0,
      totalAttendees: 0,
    });
  } catch (error) {
    console.error("Error fetching organizer:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizer" },
      { status: 500 }
    );
  }
}
