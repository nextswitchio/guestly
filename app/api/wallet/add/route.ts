import { NextRequest, NextResponse } from "next/server";
import { addMoney } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const amount: number = body?.amount || 0;
  if (amount <= 0) return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
  const balance = addMoney(userId(req), amount, "Wallet top up");
  return NextResponse.json({ ok: true, balance });
}

