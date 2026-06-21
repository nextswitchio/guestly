import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

async function refreshAccessToken(req: NextRequest): Promise<string | null> {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh?token=${refreshToken}`, {
      method: "POST",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  const attempt = async (authToken: string | undefined) => {
    return fetch(`${BACKEND_URL}/api/v1/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  try {
    let res = await attempt(token);

    // If 401, try refreshing the token once and retry
    if (res.status === 401) {
      const newToken = await refreshAccessToken(req);
      if (newToken) {
        token = newToken;
        res = await attempt(newToken);
      }
    }

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`[PUT /api/events/:id] Failed to parse response: ${text}`);
        // Return the error response from backend
        return NextResponse.json(
          { error: "Backend error", details: text },
          { status: res.status }
        );
      }
    }
    const response = NextResponse.json(data, { status: res.status });

    // If we got a new token, set it in the response cookie
    if (token && token !== req.cookies.get("access_token")?.value) {
      response.cookies.set("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 1800,
      });
    }

    return response;
  } catch (err) {
    console.error("[PUT /api/events/:id] error:", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get("access_token")?.value;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}`, {
      method: "DELETE",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
