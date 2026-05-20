import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const page = searchParams.get("page") || "1";
  const page_size = searchParams.get("page_size") || "20";

  let url = `${BACKEND_URL}/api/v1/community/search?q=${encodeURIComponent(q)}&page=${page}&page_size=${page_size}`;
  if (type) url += `&search_type=${type}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: true, data: [], total: 0 });
  }
}
