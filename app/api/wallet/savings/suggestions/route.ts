import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const targetId = req.nextUrl.searchParams.get("targetId");
    if (!targetId) {
      return NextResponse.json({ error: "targetId is required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${targetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Savings target not found" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const target = await res.json();
    const remaining = target.goal_amount - target.current_amount;
    const suggestion = remaining > 0
      ? {
          suggestedAmount: Math.max(1, Math.ceil(remaining / 4)),
          remaining,
          goalAmount: target.goal_amount,
          currentAmount: target.current_amount,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: suggestion
        ? { ...suggestion, goalReached: false, target: { id: target.id, goalAmount: target.goal_amount, currentAmount: target.current_amount, remaining } }
        : { message: "You've already reached your savings goal!", goalReached: true },
    });
  } catch {
    return NextResponse.json({ error: "Failed to calculate suggestion" }, { status: 500 });
  }
}
