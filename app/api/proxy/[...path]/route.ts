import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "";
  const query = searchParams.get("query") ? `?${searchParams.get("query")}` : "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/${path}${query}`, {
      headers: getAuthHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "";
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "";
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path") || "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/${path}`, {
      method: "DELETE",
      headers: getAuthHeaders(req),
    });
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
