import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { target_id, amount, recurring, frequency } = body;

    if (!target_id) {
      return NextResponse.json({ error: "Target ID is required" }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${target_id}/contribute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, recurring, frequency }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to contribute" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to contribute to savings" }, { status: 500 });
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

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${targetId}/cancel-recurring`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to cancel recurring" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to cancel recurring contribution" }, { status: 500 });
  }
}
