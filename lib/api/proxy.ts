import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function proxyToBackend(
  req: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}${backendPath}`;
  const searchParams = req.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  } else {
    const token = req.cookies.get("access_token")?.value;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    method: req.method,
    headers,
    body,
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  }

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function fetchBackendJson(
  req: NextRequest,
  backendPath: string,
  init: RequestInit = {},
): Promise<{ data: any; status: number; ok: boolean }> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}${backendPath}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers.Authorization = authHeader;
  } else {
    const token = req.cookies.get("access_token")?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, headers });
  const data = await res.json().catch(() => null);
  return { data, status: res.status, ok: res.ok };
}

export function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/access_token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

export function requireAuth(req: NextRequest): NextResponse | null {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return null;
}
