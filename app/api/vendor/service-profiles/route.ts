import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendor = await res.json();
    return NextResponse.json({ ok: true, profiles: vendor.service_profiles || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch service profiles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const vendorRes = await fetch(`${BACKEND_URL}/api/v1/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!vendorRes.ok) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendor = await vendorRes.json();
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/${vendor.id}/services`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create service profile" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, profile: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service profile" }, { status: 500 });
  }
}
