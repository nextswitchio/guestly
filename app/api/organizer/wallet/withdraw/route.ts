import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, method, bankDetails, cryptoDetails, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    if (!method || (method !== "bank" && method !== "crypto")) {
      return NextResponse.json({ error: "Invalid withdrawal method" }, { status: 400 });
    }

    let backendBody: Record<string, any> = { amount };

    if (method === "bank" && bankDetails) {
      backendBody.bank_name = bankDetails.bankName || "";
      backendBody.account_number = bankDetails.accountNumber || "";
      backendBody.account_name = bankDetails.accountName || "";
    } else if (method === "crypto" && cryptoDetails) {
      backendBody.bank_name = cryptoDetails.cryptoType || "";
      backendBody.account_number = cryptoDetails.address || "";
      backendBody.account_name = "Crypto Withdrawal";
    } else {
      return NextResponse.json({ error: "Invalid withdrawal details" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/withdraw`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendBody),
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
    return NextResponse.json({ success: true, data: data.withdrawals || [], total: data.total || 0 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}
