import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 0 };
  response.cookies.set("access_token", "", opts);
  response.cookies.set("refresh_token", "", opts);
  response.cookies.set("role", "", opts);
  response.cookies.set("user_role", "", opts);
  response.cookies.set("user_id", "", opts);
  return response;
}
