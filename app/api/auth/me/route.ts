import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!token && refreshToken) {
    const refreshRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh?token=${refreshToken}`, {
      method: "POST",
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      token = refreshData.access_token;
    }
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const response = NextResponse.json({ ok: false, error: res.status === 401 ? "Session expired" : "Token expired" }, { status: 401 });
      response.cookies.set("access_token", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("refresh_token", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("role", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("user_role", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      response.cookies.set("user_id", "", { maxAge: 0, path: "/", sameSite: "none", secure: true });
      return response;
    }

    const user = await res.json();
    const role = user?.role;
    const response = NextResponse.json({ ok: true, user, role });
    response.cookies.set("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 86400,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
