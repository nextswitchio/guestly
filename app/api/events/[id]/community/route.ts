import { NextRequest, NextResponse } from "next/server";
import { addDiscussion, listDiscussions } from "@/lib/store";

function roleName(role?: string) {
  if (role === "organiser") return "Organiser";
  if (role === "vendor") return "Vendor";
  return "Attendee";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const posts = listDiscussions(id);
  return NextResponse.json({ ok: true, data: posts });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const message: string = body?.message || "";
    if (!message.trim()) {
      return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
    }
    const role = req.cookies.get("role")?.value;
    if (!role) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const post = addDiscussion(id, roleName(role), message.trim());
    return NextResponse.json({ ok: true, data: post });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to post" }, { status: 500 });
  }
}

