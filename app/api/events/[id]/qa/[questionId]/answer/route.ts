import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const { questionId } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  // Only organizers can answer questions
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { answer, answeredBy } = body;

    if (!answer || !answeredBy) {
      return NextResponse.json(
        { success: false, error: "Answer and answeredBy required" },
        { status: 400 }
      );
    }

    const question = answerQuestion(questionId, answer, answeredBy);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to answer question" },
      { status: 500 }
    );
  }
}
