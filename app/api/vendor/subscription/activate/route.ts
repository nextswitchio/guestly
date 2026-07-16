import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

type SubscriptionPlan = "1m" | "3m" | "6m" | "12m";

const SUBSCRIPTION_PLANS = new Set<SubscriptionPlan>(["1m", "3m", "6m", "12m"]);

/**
 * POST /api/vendor/subscription/activate
 * Activate or upgrade vendor subscription
 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { plan } = body as { plan: SubscriptionPlan };

  if (!plan || !SUBSCRIPTION_PLANS.has(plan)) {
    return NextResponse.json(
      { error: "Invalid subscription plan" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/me/subscription`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json().catch((err) => { console.error("Failed to parse subscription activation response:", err); return null; });

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail || data?.error || "Failed to activate subscription" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to activate subscription" }, { status: 500 });
  }
}
