import { NextRequest, NextResponse } from "next/server";
import { getDiscussionThread, listThreadReplies } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  const { threadId } = await params;
  
  const thread = getDiscussionThread(threadId);
  if (!thread) {
    return NextResponse.json(
      { success: false, error: "Thread not found" },
      { status: 404 }
    );
  }
  
  const replies = listThreadReplies(threadId);
  
  return NextResponse.json({ 
    success: true, 
    data: { thread, replies } 
  });
}
