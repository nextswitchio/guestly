import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: targetUserId } = await params;
    const requestingUserId = req.cookies.get("user_id")?.value;

    if (!requestingUserId || requestingUserId !== targetUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [walletRes, transactionsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/wallet/`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BACKEND_URL}/api/v1/wallet/transactions?page=1&page_size=20`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const wallet = walletRes.ok ? await walletRes.json() : null;
    const transactions = transactionsRes.ok ? await transactionsRes.json() : { transactions: [] };

    return NextResponse.json({
      ok: true,
      wallet,
      transactions: transactions.transactions || [],
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 });
  }
}
