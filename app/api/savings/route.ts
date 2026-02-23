import { NextRequest, NextResponse } from "next/server";
import { getSavings, setSavingsGoal } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function GET(req: NextRequest) {
  const s = getSavings(userId(req));
  return NextResponse.json({ ok: true, ...s });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const goal: number = body?.goal || 0;
  setSavingsGoal(userId(req), goal);
  return NextResponse.json({ ok: true });
}

