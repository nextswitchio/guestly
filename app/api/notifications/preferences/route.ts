import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function toCamelCase(pref: Record<string, unknown>) {
  return {
    geoNotificationsEnabled: pref.geo_notifications_enabled,
    notificationRadius: pref.notification_radius,
    categories: pref.categories || [],
    minPrice: pref.min_price ?? undefined,
    maxPrice: pref.max_price ?? undefined,
    updatedAt: pref.updated_at,
  };
}

function toSnakeCase(body: Record<string, unknown>) {
  return {
    geo_notifications_enabled: body.geoNotificationsEnabled,
    notification_radius: body.notificationRadius,
    categories: body.categories,
    min_price: body.minPrice ?? null,
    max_price: body.maxPrice ?? null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch preferences" }));
      return NextResponse.json({ success: false, error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: toCamelCase(data) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const backendBody = toSnakeCase(body);

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/preferences`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendBody),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update preferences" }));
      return NextResponse.json({ success: false, error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: toCamelCase(data) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 });
  }
}
