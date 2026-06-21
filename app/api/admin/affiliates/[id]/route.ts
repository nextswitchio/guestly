import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate token exists - backend will handle role validation via JWT
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/affiliates/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating affiliate:", error);
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to update affiliate" } },
      { status: 502 }
    );
  }
}
