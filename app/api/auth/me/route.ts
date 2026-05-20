import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const response = NextResponse.json({ ok: false, error: "Token expired" }, { status: 401 });
      response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
      response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
      response.cookies.set("role", "", { maxAge: 0, path: "/" });
      response.cookies.set("user_id", "", { maxAge: 0, path: "/" });
      return response;
    }

    const user = await res.json();
    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
