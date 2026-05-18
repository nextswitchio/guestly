import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      api: "operational",
      websocket: "operational",
      store: "operational"
    }
  });
}