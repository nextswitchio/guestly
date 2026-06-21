import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  const { threadId } = await params;
  const { data, status, ok } = await fetchBackendJson(req, `/api/v1/community/discussions/${threadId}/replies`);
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ success: true, data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const body = await req.json();
    const { content, parentReplyId } = body;
    
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }
    
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/community/discussions/${threadId}/replies`,
      { method: "POST", body: JSON.stringify({ content: content.trim(), parent_reply_id: parentReplyId }) },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
