import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.detail || "Login failed" },
        { status: res.status }
      );
    }

    if (data.user?.role !== "admin") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: data.user,
      role: "admin",
    });

    response.cookies.set("access_token", data.tokens.access_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: data.tokens.expires_in || 1800,
    });
    response.cookies.set("refresh_token", data.tokens.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("role", "admin", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("user_id", data.user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("admin_name", data.user.display_name || data.user.email || "Admin User", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
