import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toClientVendor(vendor: Record<string, any>) {
  return {
    ...vendor,
    userId: vendor.user_id ?? vendor.userId,
    contactEmail: vendor.contact_email ?? vendor.contactEmail,
    contactPhone: vendor.contact_phone ?? vendor.contactPhone,
    rateCard: vendor.rate_card ?? vendor.rateCard,
    reviewCount: vendor.review_count ?? vendor.reviewCount,
    completedEvents: vendor.completed_events ?? vendor.completedEvents,
    createdAt: vendor.created_at ?? vendor.createdAt,
    updatedAt: vendor.updated_at ?? vendor.updatedAt,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const page_size = searchParams.get("page_size") || "20";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const userId = searchParams.get("userId");

  let url = `${BACKEND_URL}/api/v1/vendors/?page=${page}&page_size=${userId ? "100" : page_size}`;
  if (category) url += `&category=${category}`;
  if (city) url += `&city=${city}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const vendors = Array.isArray(data.vendors) ? data.vendors.map(toClientVendor) : [];
    const filtered = userId ? vendors.filter((vendor: Record<string, any>) => vendor.userId === userId || vendor.id === userId) : vendors;
    return NextResponse.json({ ...data, vendors: filtered, data: filtered }, { status: res.status });
  } catch {
    return NextResponse.json({ vendors: [], data: [], total: 0, page: 1, page_count: 1 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
