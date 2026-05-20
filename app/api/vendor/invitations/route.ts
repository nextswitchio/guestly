import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/invitations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch invitations" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { invitation_id, status } = body;

    if (!invitation_id || !status) {
      return NextResponse.json({ error: "invitation_id and status required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/invitations/${invitation_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update invitation" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update invitation" }, { status: 500 });
  }
}
