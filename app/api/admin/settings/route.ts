import { NextRequest, NextResponse } from "next/server";

const defaultSettings = {
  platform_name: "GUESTLY",
  commission_rate: 5,
  currency: "NGN",
  maintenance_mode: false,
  registration_open: true,
  email_notifications: true,
  sms_notifications: false,
  featured_events_limit: 10,
  max_ticket_price: 1000000,
  min_ticket_price: 0,
  refund_policy: "standard",
  terms_url: "/terms",
  privacy_url: "/privacy",
};

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: defaultSettings,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    success: true,
    message: "Settings updated successfully",
    settings: { ...defaultSettings, ...body },
  });
}
