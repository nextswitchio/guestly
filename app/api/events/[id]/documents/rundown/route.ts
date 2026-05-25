import { NextRequest, NextResponse } from "next/server";
import { listDocuments, saveRundown, updateRundown, type RundownItem } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docs = listDocuments(id).filter((d) => d.type === "rundown");
  return NextResponse.json({ ok: true, data: docs });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const title = body.title || "Event Rundown";
    const rundownItems: RundownItem[] = body.rundownItems || [];
    const doc = saveRundown(id, title, rundownItems);
    return NextResponse.json({ ok: true, data: doc });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to create rundown" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    if (!body.docId) return NextResponse.json({ ok: false, error: "Document ID is required" }, { status: 400 });
    const doc = updateRundown(id, body.docId, body.title || "Event Rundown", body.rundownItems || []);
    if (!doc) return NextResponse.json({ ok: false, error: "Rundown not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: doc });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to update rundown" }, { status: 500 });
  }
}
