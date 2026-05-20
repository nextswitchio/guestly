import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { user_id, name, target_amount } = body;

    if (!user_id || !name || typeof target_amount !== "number") {
      return NextResponse.json({ error: "Invalid member data" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/groups/${id}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, name, target_amount }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to add member" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}
