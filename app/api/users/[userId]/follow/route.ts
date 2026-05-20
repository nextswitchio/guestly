import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type = "user" } = body;

    const res = await fetch(`${BACKEND_URL}/api/v1/community/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ following_id: followingId, follow_type: type }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to follow" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "user";

    const res = await fetch(`${BACKEND_URL}/api/v1/community/follow/${followingId}?follow_type=${type}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to unfollow" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetId } = await params;
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ isFollowing: false });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ isFollowing: false });
    }

    const following = await res.json();
    const isFollowing = following.some((f: { following_id: string }) => f.following_id === targetId);

    return NextResponse.json({ isFollowing });
  } catch {
    return NextResponse.json({ isFollowing: false });
  }
}
