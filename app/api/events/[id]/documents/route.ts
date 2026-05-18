import { NextRequest, NextResponse } from "next/server";
import { listDocuments, uploadDocument, deleteDocument, getDocument } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docs = listDocuments(id);
  return NextResponse.json({ ok: true, data: docs });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await req.json();
    
    if (!body.title || !body.type || !body.fileName || !body.fileData) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const doc = uploadDocument(id, {
      title: body.title,
      type: body.type,
      fileName: body.fileName,
      fileSize: body.fileSize || 0,
      mimeType: body.mimeType || "application/octet-stream",
      fileData: body.fileData,
    });

    return NextResponse.json({ ok: true, data: doc });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId");

  if (!docId) {
    return NextResponse.json(
      { ok: false, error: "Document ID is required" },
      { status: 400 }
    );
  }

  const success = deleteDocument(id, docId);

  if (!success) {
    return NextResponse.json(
      { ok: false, error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
