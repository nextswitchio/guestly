import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status, ok } = await fetchBackendJson(req, `/api/v1/community/events/${id}/discussions`);
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ success: true, data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await req.json();
    const { title, content } = body;
    
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/community/events/${eventId}/discussions`,
      { method: "POST", body: JSON.stringify({ title: title.trim(), content: content.trim() }) },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
