import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { crypto_type, address, amount, amount_usd } = body;

    if (!crypto_type || !address || !amount || !amount_usd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (amount <= 0 || amount_usd <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/crypto-deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ crypto_type, address, amount, amount_usd }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create deposit" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, deposit: data });
  } catch {
    return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 });
  }
}
