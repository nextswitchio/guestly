import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const past = new Date(0);
  const opts = { httpOnly: true, sameSite: "none" as const, secure: true, path: "/", expires: past, maxAge: 0 };
  const cookies = ["access_token", "refresh_token", "role", "user_role", "user_id"];
  for (const name of cookies) {
    response.cookies.set(name, "", opts);
  }
  return response;
}
