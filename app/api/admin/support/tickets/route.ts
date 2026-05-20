import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    tickets: [],
    total: 0,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { action, ticketId, message } = body;

  return NextResponse.json({
    success: true,
    message: `Action "${action}" processed for ticket ${ticketId}`,
  });
}
