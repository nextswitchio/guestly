import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const subPath = searchParams.get("sub") || "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/${subPath}`, {
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
  const subPath = searchParams.get("sub") || "";
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/${subPath}`, {
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
