import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid, getOrder, debitMoney } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const orderId: string = body?.orderId;
  if (!orderId) return NextResponse.json({ ok: false, error: "orderId required" }, { status: 400 });
  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });
  markOrderPaid(orderId);
  // Simulate wallet debit if enough balance; otherwise do nothing (card payment)
  if (order.total > 0) {
    debitMoney(order.userId, order.total, `Order ${orderId} payment`);
  }
  return NextResponse.json({ ok: true });
}

