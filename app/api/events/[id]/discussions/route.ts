import { NextRequest, NextResponse } from "next/server";
import { 
  createDiscussionThread, 
  listDiscussionThreads 
} from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const threads = listDiscussionThreads(id);
  return NextResponse.json({ success: true, data: threads });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const userId = req.cookies.get("user_id")?.value;
    const role = req.cookies.get("role")?.value;
    
    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { title, content } = body;
    
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // Generate author name based on role
    const authorName = role === "organiser" 
      ? "Organizer" 
      : role === "vendor" 
        ? "Vendor" 
        : "Attendee";
    
    const thread = createDiscussionThread(
      eventId,
      userId,
      authorName,
      title.trim(),
      content.trim()
    );
    
    return NextResponse.json({ success: true, data: thread });
  } catch (error) {
    console.error("Error creating discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
