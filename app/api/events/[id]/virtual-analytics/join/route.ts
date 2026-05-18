import { NextRequest, NextResponse } from "next/server";
import { joinVirtualEvent } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const attendee = joinVirtualEvent(eventId, userId);
    return NextResponse.json({ success: true, data: attendee });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to join event" },
      { status: 500 }
    );
  }
}
