import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

type VendorSubscription = {
  plan: "1m" | "3m" | "6m" | "12m";
  activatedAt: number;
  expiresAt: number;
};

type BackendVendor = {
  subscription?: Partial<VendorSubscription>;
  subscription_plan?: VendorSubscription["plan"];
  subscription_activated_at?: string | number | null;
  subscription_expires_at?: string | number | null;
};

function getMaxServiceProfiles(subscription?: VendorSubscription | null): number {
  if (!subscription) return 1;
  if (subscription.plan === "1m") return 3;
  if (subscription.plan === "3m") return 10;
  return Number.MAX_SAFE_INTEGER;
}

function toTimestamp(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function readSubscription(vendor: BackendVendor): VendorSubscription | null {
  const plan = vendor.subscription?.plan ?? vendor.subscription_plan;
  const activatedAt = toTimestamp(vendor.subscription?.activatedAt ?? vendor.subscription_activated_at);
  const expiresAt = toTimestamp(vendor.subscription?.expiresAt ?? vendor.subscription_expires_at);

  if (!plan || !activatedAt || !expiresAt) return null;
  return { plan, activatedAt, expiresAt };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      return NextResponse.json({
        success: true,
        subscription: null,
        isPremium: false,
        maxServiceProfiles: 1,
        hasVendorProfile: false,
      });
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch vendor subscription" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const vendor = await res.json();
    const subscription = readSubscription(vendor);

    return NextResponse.json({
      success: true,
      subscription,
      isPremium: !!subscription && subscription.expiresAt > Date.now(),
      maxServiceProfiles: getMaxServiceProfiles(subscription),
      hasVendorProfile: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor subscription" }, { status: 500 });
  }
}
