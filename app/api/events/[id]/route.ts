import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/events";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const item = getEventById(id);
  if (!item) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, data: item });
}
