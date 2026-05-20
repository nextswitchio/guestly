import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

const REACTION_TYPES: Record<string, string> = {
  Clap: "clap",
  clap: "clap",
  Heart: "heart",
  heart: "heart",
  "❤️": "heart",
  "🔥": "fire",
  fire: "fire",
  "🎉": "party",
  party: "party",
  "👍": "thumbs_up",
  thumbs_up: "thumbs_up",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type === "counts") {
    const { data, status, ok } = await fetchBackendJson(req, `/api/v1/events/${eventId}/reactions/counts`);
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ success: true, data });
  }

  const reactionType = type ? REACTION_TYPES[type] : null;
  const backendPath = reactionType
    ? `/api/v1/events/${eventId}/reactions?type=${encodeURIComponent(reactionType)}`
    : `/api/v1/events/${eventId}/reactions`;
  const { data, status, ok } = await fetchBackendJson(req, backendPath);
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const reactionType = REACTION_TYPES[body.type];

    if (!reactionType) {
      return NextResponse.json(
        { success: false, error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/events/${eventId}/reactions`,
      { method: "POST", body: JSON.stringify({ reaction_type: reactionType }) },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add reaction" },
      { status: 500 }
    );
  }
}
