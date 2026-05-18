import { NextRequest, NextResponse } from "next/server";
import { getVendorByUserId, updateVendorSubscription, getWallet, debitMoney } from "@/lib/store";

type SubscriptionPlan = "1m" | "3m" | "6m" | "12m";

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  "1m": 4999, // ₦49.99
  "3m": 12999, // ₦129.99
  "6m": 23999, // ₦239.99
  "12m": 44999, // ₦449.99
};

const PLAN_DURATIONS: Record<SubscriptionPlan, number> = {
  "1m": 30 * 24 * 60 * 60 * 1000, // 30 days
  "3m": 90 * 24 * 60 * 60 * 1000, // 90 days
  "6m": 180 * 24 * 60 * 60 * 1000, // 180 days
  "12m": 365 * 24 * 60 * 60 * 1000, // 365 days
};

/**
 * POST /api/vendor/subscription/activate
 * Activate or upgrade vendor subscription
 */
export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const vendor = getVendorByUserId(userId);

  if (!vendor) {
    return NextResponse.json(
      { error: "Vendor profile not found" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { plan } = body as { plan: SubscriptionPlan };

  if (!plan || !PLAN_PRICES[plan]) {
    return NextResponse.json(
      { error: "Invalid subscription plan" },
      { status: 400 }
    );
  }

  const price = PLAN_PRICES[plan];
  const duration = PLAN_DURATIONS[plan];

  // Check wallet balance
  const wallet = getWallet(userId);
  if (!wallet || wallet.balance < price) {
    return NextResponse.json(
      { error: "Insufficient wallet balance" },
      { status: 400 }
    );
  }

  // Debit wallet
  debitMoney(userId, price, `Vendor ${plan} subscription`);

  // Calculate expiration date
  const now = Date.now();
  const expiresAt = now + duration;

  // Update vendor subscription
  const subscription = {
    plan,
    activatedAt: now,
    expiresAt,
  };

  updateVendorSubscription(vendor.id, subscription);

  return NextResponse.json({
    success: true,
    subscription,
    message: "Subscription activated successfully",
  });
}
