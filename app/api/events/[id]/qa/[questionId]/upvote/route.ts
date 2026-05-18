import { NextRequest, NextResponse } from "next/server";
import { upvoteQuestion, hasUserUpvoted } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const { questionId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if already upvoted
    if (hasUserUpvoted(questionId, userId)) {
      return NextResponse.json(
        { success: false, error: "Already upvoted this question" },
        { status: 400 }
      );
    }

    const question = upvoteQuestion(questionId, userId);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to upvote" },
      { status: 500 }
    );
  }
}
