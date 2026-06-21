import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        snakeToCamel(v),
      ])
    );
  }
  return obj;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  const { threadId } = await params;
  const [threadResult, repliesResult] = await Promise.all([
    fetchBackendJson(req, `/api/v1/community/discussions/${threadId}`),
    fetchBackendJson(req, `/api/v1/community/discussions/${threadId}/replies`),
  ]);

  if (!threadResult.ok) return NextResponse.json(threadResult.data, { status: threadResult.status });
  if (!repliesResult.ok) return NextResponse.json(repliesResult.data, { status: repliesResult.status });

  return NextResponse.json({ 
    success: true, 
    data: { 
      thread: snakeToCamel(threadResult.data), 
      replies: snakeToCamel(repliesResult.data) 
    } 
  });
}
