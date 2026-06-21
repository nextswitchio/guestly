import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { fromBackendServiceProfile, toBackendServiceProfile } from "@/lib/api/serviceProfiles";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, profile: fromBackendServiceProfile(data) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch service profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const payload = toBackendServiceProfile(body);

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, profile: fromBackendServiceProfile(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update service profile" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Service profile not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const payload = toBackendServiceProfile(body);

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/service-profiles/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, profile: fromBackendServiceProfile(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update service profile" }, { status: 500 });
  }
}
