import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ ok: false, error: "No refresh token" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh?token=${refreshToken}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      const response = NextResponse.json(
        { ok: false, error: data.detail || "Refresh failed" },
        { status: res.status }
      );
      response.cookies.set("access_token", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("refresh_token", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("role", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("user_role", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      return response;
    }

    const response = NextResponse.json({
      ok: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: data.expires_in || 86400,
    });
    response.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
