import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ depositId: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { depositId } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/crypto-deposits/${depositId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, deposit: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch deposit" }, { status: 500 });
  }
}
