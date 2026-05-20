import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    success: true,
    message: "Webhook received",
    event_id: body.event_id || body.reference,
  });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
