import { NextRequest, NextResponse } from "next/server";
import { addReplyToThread, listThreadReplies } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  const { threadId } = await params;
  const replies = listThreadReplies(threadId);
  return NextResponse.json({ success: true, data: replies });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;
    
    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { content, parentReplyId } = body;
    
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }
    
    // Generate author name based on role
    const authorName = role === "organiser" 
      ? "Organizer" 
      : role === "vendor" 
        ? "Vendor" 
        : "Attendee";
    
    const reply = addReplyToThread(
      threadId,
      userId,
      authorName,
      content.trim(),
      parentReplyId
    );
    
    if (!reply) {
      return NextResponse.json(
        { success: false, error: parentReplyId ? "Parent reply not found" : "Thread not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: reply });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
