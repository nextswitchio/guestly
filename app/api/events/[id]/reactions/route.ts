import { Heart } from 'lucide-react';
import { NextRequest, NextResponse } from "next/server";
import { addReaction, listReactions, getReactionCounts } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type === "counts") {
    const counts = getReactionCounts(eventId);
    return NextResponse.json({ success: true, data: counts });
  }

  const reactions = listReactions(eventId);
  return NextResponse.json({ success: true, data: reactions });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type } = body;

    const validTypes = ['Clap', '<Heart className="h-4 w-4 inline-block" />️', '🔥', '🎉', '👍'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const reaction = addReaction(eventId, userId, type);
    return NextResponse.json({ success: true, data: reaction });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add reaction" },
      { status: 500 }
    );
  }
}
