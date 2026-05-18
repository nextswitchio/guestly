import { NextRequest, NextResponse } from "next/server";
import { createPoll, listPolls } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const polls = listPolls(eventId);
  return NextResponse.json({ success: true, data: polls });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, options } = body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { success: false, error: "Question and at least 2 options required" },
        { status: 400 }
      );
    }

    const poll = createPoll(eventId, userId, question, options);
    return NextResponse.json({ success: true, data: poll });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
