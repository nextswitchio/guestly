import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = body?.amount || 0;
    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to add funds" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to add funds" }, { status: 500 });
  }
}
