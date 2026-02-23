import { NextRequest, NextResponse } from "next/server";
import { getOrder, ensureWallet, markOrderPaid, debitMoney } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId: string = body?.orderId;
  const method: "wallet" | "card" = body?.method || "card";
  if (!orderId) return NextResponse.json({ ok: false, error: "orderId required" }, { status: 400 });
  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });
  if (method === "wallet") {
    const w = ensureWallet(order.userId);
    if (w.balance < order.total) {
      return NextResponse.json({ ok: false, error: "Insufficient wallet balance" }, { status: 400 });
    }
    debitMoney(order.userId, order.total, `Order ${orderId} wallet payment`);
    markOrderPaid(orderId);
    return NextResponse.json({ ok: true });
  } else {
    markOrderPaid(orderId);
    return NextResponse.json({ ok: true });
  }
}
