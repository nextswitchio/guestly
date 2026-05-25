import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/organiser-subscription-plans`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch subscription plans");
    const data = await res.json();
    return NextResponse.json({ ok: true, plans: data });
  } catch {
    return NextResponse.json({
      ok: true,
      plans: { "1m": 9999, "3m": 24999, "6m": 44999, "12m": 79999 },
    });
  }
}
