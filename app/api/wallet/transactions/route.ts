import { NextRequest, NextResponse } from "next/server";
import { listTransactions } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function GET(req: NextRequest) {
  const list = listTransactions(userId(req));
  return NextResponse.json({ ok: true, transactions: list });
}

