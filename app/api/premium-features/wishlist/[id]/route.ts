import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/premium-features/wishlist/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(request),
    });
    return new NextResponse(null, { status: res.status });
  } catch (err) {
    console.error("[premium-features wishlist delete]", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
