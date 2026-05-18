import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { id, docId } = await params;
  
  const doc = getDocument(id, docId);

  if (!doc) {
    return NextResponse.json(
      { ok: false, error: "Document not found" },
      { status: 404 }
    );
  }

  // For charter documents (text content), return as text file
  if (doc.type === "charter" && doc.content) {
    const buffer = Buffer.from(doc.content, "utf-8");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${doc.fileName || doc.title + ".txt"}"`,
      },
    });
  }

  // For uploaded files, decode base64 and return
  if (doc.fileData) {
    const buffer = Buffer.from(doc.fileData, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${doc.fileName || doc.title}"`,
      },
    });
  }

  return NextResponse.json(
    { ok: false, error: "No file data available" },
    { status: 404 }
  );
}
