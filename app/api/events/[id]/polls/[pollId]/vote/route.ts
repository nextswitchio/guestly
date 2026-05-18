import { NextRequest, NextResponse } from "next/server";
import { votePoll, hasUserVoted } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> }
) {
  const { pollId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { optionId } = body;

    if (!optionId) {
      return NextResponse.json(
        { success: false, error: "Option ID required" },
        { status: 400 }
      );
    }

    // Check if already voted
    if (hasUserVoted(pollId, userId)) {
      return NextResponse.json(
        { success: false, error: "Already voted on this poll" },
        { status: 400 }
      );
    }

    const poll = votePoll(pollId, optionId, userId);
    
    if (!poll) {
      return NextResponse.json(
        { success: false, error: "Poll not found or closed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: poll });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to vote" },
      { status: 500 }
    );
  }
}
