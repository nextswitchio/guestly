import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

const TYPE_MAP: Record<string, string> = {
  'thumbs-up': 'thumbs_up',
  'clap': 'clap',
  'heart': 'heart',
  'fire': 'fire',
  'party': 'party',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/community/discussions/${threadId}/reactions/counts`,
  );
  if (!ok) return NextResponse.json(data, { status });
  const mapped: Record<string, number> = {};
  for (const [key, val] of Object.entries(data)) {
    const k = key === 'thumbs_up' ? 'thumbs-up' : key;
    mapped[k] = val as number;
  }
  return NextResponse.json({ success: true, data: mapped });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  const body = await req.json();
  const reactionType = TYPE_MAP[body.type] || body.type;
  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/community/discussions/${threadId}/reactions`,
    { method: "POST", body: JSON.stringify({ reaction_type: reactionType }) },
  );
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ success: true, data });
}
