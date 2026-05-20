import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch savings targets" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch savings targets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { event_id, goal_amount, target_date } = body;

    if (!goal_amount || goal_amount <= 0) {
      return NextResponse.json({ error: "Goal amount must be greater than 0" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id, goal_amount, target_date }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create savings target" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to create savings target" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { target_id, goal_amount, target_date } = body;

    if (!target_id) {
      return NextResponse.json({ error: "Target ID is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${target_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal_amount, target_date }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update savings target" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update savings target" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json({ error: "Target ID is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${targetId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to delete savings target" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json({ error: "Failed to delete savings target" }, { status: 500 });
  }
}
