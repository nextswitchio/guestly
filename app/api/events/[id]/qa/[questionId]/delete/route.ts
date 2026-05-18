import { NextRequest, NextResponse } from "next/server";
import { deleteQuestion, getQuestion } from "@/lib/store";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const { id: eventId, questionId } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  // Only organizers can delete questions
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify question exists and belongs to this event
    const question = getQuestion(questionId);
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.eventId !== eventId) {
      return NextResponse.json(
        { success: false, error: "Question does not belong to this event" },
        { status: 400 }
      );
    }

    const deleted = deleteQuestion(questionId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Failed to delete question" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { questionId } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
