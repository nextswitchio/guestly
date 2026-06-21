import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { fromBackendServiceProfile, toBackendServiceProfile } from "@/lib/api/serviceProfiles";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch service profiles" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    const profiles = Array.isArray(data) ? data : data.profiles || [];
    return NextResponse.json({
      ok: true,
      profiles: profiles.map(fromBackendServiceProfile),
    });
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

    const body = await req.json();
    const payload = toBackendServiceProfile(body);

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create service profile" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, profile: fromBackendServiceProfile(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service profile" }, { status: 500 });
  }
}
