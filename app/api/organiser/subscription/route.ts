import { NextRequest, NextResponse } from "next/server";
import { activateOrganiserSubscription, getOrganiserSubscription, type OrganiserPlan } from "@/lib/store";

function userId(req: NextRequest) {
  const uid = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  if (!uid || role !== "organiser") throw new Error("Unauthorized");
  return uid;
}

export async function GET(req: NextRequest) {
  try {
    const sub = getOrganiserSubscription(userId(req));
    return NextResponse.json({ ok: true, subscription: sub });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = body?.plan as OrganiserPlan | undefined;
    if (!plan || !["1m", "3m", "6m", "12m"].includes(plan)) {
      return NextResponse.json({ ok: false, error: "Invalid plan" }, { status: 400 });
    }
    const sub = activateOrganiserSubscription(userId(req), plan);
    return NextResponse.json({ ok: true, subscription: sub });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
}

