import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("access_token")?.value;

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}/view`, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
