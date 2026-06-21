import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") || "following";
  const headers = getAuthHeaders(req);

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/community/${type}`,
      { headers }
    );
    const follows: any[] = await res.json();

    const enriched = await Promise.all(
      follows.map(async (f) => {
        const orgId = f.following_id;
        try {
          const profileRes = await fetch(
            `${BACKEND_URL}/api/v1/users/${orgId}`,
            { headers }
          );
          if (!profileRes.ok) return { ...f, display_name: "Organizer", bio: null, avatar: null, location_city: null, location_country: null };
          const profile = await profileRes.json();
          return {
            ...f,
            display_name: profile.display_name || profile.displayName || "Organizer",
            bio: profile.bio || null,
            avatar: profile.avatar || null,
            location_city: profile.location_city || null,
            location_country: profile.location_country || null,
          };
        } catch {
          return { ...f, display_name: "Organizer", bio: null, avatar: null, location_city: null, location_country: null };
        }
      })
    );

    return NextResponse.json({ success: true, data: enriched }, { status: res.status });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  const followingId = body.followingId || body.organizerId;
  const action = body.action || "follow";

  if (!followingId) {
    return NextResponse.json({ error: "followingId or organizerId required" }, { status: 400 });
  }

  try {
    if (action === "unfollow") {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/community/follow/${followingId}?follow_type=${body.followType || "organizer"}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return NextResponse.json({ success: res.ok, following: false }, { status: res.status });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        following_id: followingId,
        follow_type: body.followType || "organizer",
      }),
    });
    const data = await res.json();
    return NextResponse.json({ success: res.ok, following: true, ...data }, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { searchParams } = req.nextUrl;
  const followingId = searchParams.get("followingId");
  const followType = searchParams.get("followType") || "organizer";

  if (!followingId) {
    return NextResponse.json({ error: "followingId required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/community/follow/${followingId}?follow_type=${followType}`,
      {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
