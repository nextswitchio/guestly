import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrder } from "@/lib/store";

function getUserIdFromCookies(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const eventId: string = body?.eventId;
  const items: Array<{ type: "General" | "VIP"; quantity: number }> = body?.items || [];
  if (!eventId || items.length === 0) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  try {
    const userId = getUserIdFromCookies(req);
    const order = createOrder(userId, eventId, items);
    return NextResponse.json({ ok: true, order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  const order = getOrder(id);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}
