import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, method, bank_details, crypto_details, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    if (!method || (method !== "bank" && method !== "crypto")) {
      return NextResponse.json({ error: "Invalid withdrawal method" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/withdraw`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, method, bank_details, crypto_details, notes }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create withdrawal" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create withdrawal" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch withdrawals" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}
