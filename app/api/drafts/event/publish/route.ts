import { NextRequest, NextResponse } from "next/server";
import { publishEventFromDraft } from "@/lib/store";
import { hasVerifiedIdentity } from "@/lib/api/identityVerification";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "organiser" ? "organiser-user" : "attendee-user";
}

export async function POST(req: NextRequest) {
  try {
    const role = req.cookies.get("user_role")?.value || req.cookies.get("role")?.value;
    if (role !== "organiser") {
      return NextResponse.json({ ok: false, error: "Organizer access required" }, { status: 403 });
    }

    const isVerified = await hasVerifiedIdentity(req, "organiser");
    if (!isVerified) {
      return NextResponse.json(
        { ok: false, error: "Identity verification is required to create events" },
        { status: 403 },
      );
    }

    const created = publishEventFromDraft(userId(req));
    return NextResponse.json({ ok: true, event: created });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
