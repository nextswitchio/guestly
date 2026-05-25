import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildBackendUrl(req: NextRequest, params: { path: string[] }): string {
  const pathStr = params.path.join("/");
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  return `${BACKEND_URL}/api/v1/${pathStr}${qs ? `?${qs}` : ""}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  try {
    const res = await fetch(buildBackendUrl(req, resolvedParams), {
      headers: getAuthHeaders(req),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy GET]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(buildBackendUrl(req, resolvedParams), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(req) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy POST]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(buildBackendUrl(req, resolvedParams), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(req) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy PUT]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(buildBackendUrl(req, resolvedParams), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(req) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[proxy PATCH]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  try {
    const res = await fetch(buildBackendUrl(req, resolvedParams), {
      method: "DELETE",
      headers: getAuthHeaders(req),
    });
    return new NextResponse(null, { status: res.status });
  } catch (err) {
    console.error("[proxy DELETE]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
