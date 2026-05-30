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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; threadId: string }> }
) {
  const { threadId } = await params;
  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/community/discussions/${threadId}/like`,
    { method: "POST" },
  );
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ success: true, data: snakeToCamel(data) });
}
