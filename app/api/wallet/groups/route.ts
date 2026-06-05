import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, event_id, members, group_type, permissions } = body;

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Group name and members are required" }, { status: 400 });
    }

    const total_goal = members.reduce((sum: number, m: { targetAmount: number }) => sum + (m.targetAmount || 0), 0);

    const createRes = await fetch(`${BACKEND_URL}/api/v1/wallet/groups`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        event_id: event_id || undefined,
        group_type,
        permissions: permissions || undefined,
        total_goal,
        is_public: false,
      }),
    });

    if (!createRes.ok) {
      const error = await createRes.json().catch(() => ({ detail: "Failed to create group" }));
      return NextResponse.json({ error: error.detail }, { status: createRes.status });
    }

    const group = await createRes.json();

    const memberResults = await Promise.all(
      members.map((m: { userId: string; targetAmount: number }) =>
        fetch(`${BACKEND_URL}/api/v1/wallet/groups/${group.id}/members`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: m.userId, target_amount: m.targetAmount }),
        }).catch(() => null)
      )
    );

    const memberErrors = memberResults.filter((r) => r && !r.ok);
    if (memberErrors.length > 0) {
      const error = await memberErrors[0].json().catch(() => ({ detail: "Failed to add some members" }));
      return NextResponse.json({ error: error.detail }, { status: memberErrors[0].status });
    }

    return NextResponse.json({ success: true, data: group });
  } catch {
    return NextResponse.json({ error: "Failed to create group wallet" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch group wallets" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch group wallets" }, { status: 500 });
  }
}
