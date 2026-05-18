import { NextRequest, NextResponse } from "next/server";
import { publishEventFromDraft } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "organiser" ? "organiser-user" : "attendee-user";
}

export async function POST(req: NextRequest) {
  try {
    const created = publishEventFromDraft(userId(req));
    return NextResponse.json({ ok: true, event: created });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

