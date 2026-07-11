import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildBackendUrl(req: NextRequest, path: string[]): string {
  const pathStr = path.join("/");
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  return `${BACKEND_URL}/api/v1/marketplace/${pathStr}${qs ? `?${qs}` : ""}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  try {
    const res = await fetch(buildBackendUrl(req, path), {
      headers: getAuthHeaders(req),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[marketplace proxy GET]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    const res = await fetch(buildBackendUrl(req, path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders(req) },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[marketplace proxy POST]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
