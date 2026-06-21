import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password, role } = body;
  const displayName = body.displayName || body.fullName;

  if (!email || !password || !displayName) {
    return NextResponse.json(
      { ok: false, error: "Email, password, and display name required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, display_name: displayName, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.detail || "Registration failed" },
        { status: res.status }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: data.user,
      role: data.user?.role,
    });

    if (data.tokens) {
      response.cookies.set("access_token", data.tokens.access_token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: data.tokens.expires_in || 86400,
      });
      response.cookies.set("refresh_token", data.tokens.refresh_token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("role", data.user?.role || "attendee", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user_role", data.user?.role || "attendee", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("user_id", data.user?.id || "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Backend unavailable" },
      { status: 503 }
    );
  }
}
