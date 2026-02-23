import { NextRequest, NextResponse } from "next/server";
import { ensureWallet } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function GET(req: NextRequest) {
  const w = ensureWallet(userId(req));
  return NextResponse.json({ ok: true, balance: w.balance });
}

