import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const access = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;
  const userId = req.cookies.get("user_id")?.value;
  if (!access || !role) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, role, userId });
}
