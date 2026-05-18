import { NextRequest, NextResponse } from "next/server";
import { submitQuestion, listQuestions } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const questions = listQuestions(eventId);
  return NextResponse.json({ success: true, data: questions });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, userName } = body;

    if (!question || !userName) {
      return NextResponse.json(
        { success: false, error: "Question and userName required" },
        { status: 400 }
      );
    }

    const qa = submitQuestion(eventId, userId, userName, question);
    return NextResponse.json({ success: true, data: qa });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit question" },
      { status: 500 }
    );
  }
}
